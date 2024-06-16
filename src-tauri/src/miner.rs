use std::io::{BufRead, BufReader, Read};
use std::os::windows::process::CommandExt;
use std::process::Command;
use std::sync::{Arc, Mutex};
use std::thread;
use std::thread::JoinHandle;

use os_pipe::pipe;
use shared_child::SharedChild;
use tauri::async_runtime::{block_on, channel, Sender};
use tauri::{AppHandle, Manager, State};
use tokio::sync::mpsc::Receiver;

const DETACHED_PROCESS: u32 = 0x00000008;

pub struct MinerApplication {
    child: Option<Arc<SharedChild>>,
    recv: Option<Receiver<MinerEvent>>,
    stdout_task: Option<JoinHandle<()>>,
    stderr_task: Option<JoinHandle<()>>,
    wait_task: Option<JoinHandle<()>>,
}

pub enum MinerEvent {
    Output(String),
    Error(String),
    Exited(i32),
}

pub struct MinerState {
    context: Mutex<Option<MinerApplication>>,
}

#[derive(Debug, Clone, serde::Serialize)]
struct MinerOutputPayload {
    message: String,
}

#[derive(Debug, Clone, serde::Serialize)]
struct MinerErrorPayload {
    error: String,
}

#[derive(Debug, Clone, serde::Serialize)]
struct MinerExitedPayload {
    code: i32,
}

pub fn setup_miner(app: AppHandle) {
    app.manage(MinerState {
        context: Mutex::new(None),
    });
}

#[tauri::command]
pub fn is_miner_running(miner_state: State<MinerState>) -> bool {
    let context = miner_state.context.lock().unwrap();

    context.is_some()
}

#[tauri::command]
pub fn stop_miner(miner_state: State<MinerState>) -> Result<(), String> {
    let mut context = miner_state.context.lock().unwrap();

    *context = match context.as_mut() {
        None => None,
        Some(c) => {
            c.stop();
            None
        }
    };

    Ok(())
}

#[tauri::command]
pub fn run_miner(
    path: String,
    args: String,
    miner_state: State<MinerState>,
    app: AppHandle,
) -> Result<(), String> {
    let mut context = miner_state.context.lock().unwrap();
    let handle = app.app_handle();

    if context.is_none() {
        match MinerApplication::start(path, args) {
            Ok(mut miner) => {
                let mut rx = miner.recv.take().unwrap();

                tauri::async_runtime::spawn(async move {
                    while let Some(event) = rx.recv().await {
                        let _ = match event {
                            MinerEvent::Output(message) => {
                                handle.emit_all("miner-output", MinerOutputPayload { message })
                            }
                            MinerEvent::Error(message) => {
                                handle.emit_all("miner-error", MinerErrorPayload { error: message })
                            }
                            MinerEvent::Exited(code) => {
                                handle.emit_all("miner-exited", MinerExitedPayload { code })
                            }
                        };
                    }
                });

                *context = Some(miner);
                Ok(())
            }
            Err(e) => Err(e),
        }
    } else {
        Ok(())
    }
}

fn spawn_wait_for_exit(tx: Sender<MinerEvent>, child: Arc<SharedChild>) -> JoinHandle<()> {
    thread::spawn(move || {
        let _ = match child.wait() {
            Ok(status) => {
                block_on(async move { tx.send(MinerEvent::Exited(status.code().unwrap())).await })
            }
            Err(e) => block_on(async move { tx.send(MinerEvent::Error(e.to_string())).await }),
        };
    })
}

fn spawn_reader<T: Read + Send + 'static>(tx: Sender<MinerEvent>, pipe: T) -> JoinHandle<()> {
    thread::spawn(move || {
        let reader = BufReader::new(pipe);

        for line in reader.lines() {
            let tx_ = tx.clone();

            let _ = block_on(async move { tx_.send(MinerEvent::Output(line.unwrap())).await });
        }
    })
}

impl MinerApplication {
    pub fn start(path: String, args: String) -> Result<MinerApplication, String> {
        let (stdout_reader, stdout_writer) = pipe().unwrap();
        let (stderr_reader, stderr_writer) = pipe().unwrap();
        let mut command = Command::new(path);

        command
            .args(args.split_whitespace())
            .creation_flags(DETACHED_PROCESS) // Hides the console window
            .stdout(stdout_writer)
            .stderr(stderr_writer);

        match SharedChild::spawn(&mut command) {
            Ok(root_child) => {
                let shared_child = Arc::new(root_child);
                let (tx, rx) = channel(1);

                let stdout_task = spawn_reader(tx.clone(), stdout_reader);
                let stderr_task = spawn_reader(tx.clone(), stderr_reader);
                let wait_task = spawn_wait_for_exit(tx.clone(), shared_child.clone());

                Ok(MinerApplication {
                    child: Some(shared_child),
                    recv: Some(rx),
                    stdout_task: Some(stdout_task),
                    stderr_task: Some(stderr_task),
                    wait_task: Some(wait_task),
                })
            }
            Err(e) => Err(e.to_string()),
        }
    }

    pub fn stop(&mut self) {
        self.child
            .take()
            .unwrap()
            .kill()
            .expect("Could not kill miner");

        self.stdout_task.take().unwrap().join().unwrap();
        self.stderr_task.take().unwrap().join().unwrap();
        self.wait_task.take().unwrap().join().unwrap();
    }
}
