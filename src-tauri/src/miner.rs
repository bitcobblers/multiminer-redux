use std::io::{BufRead, BufReader, Read};
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::thread;
use std::thread::JoinHandle;

use tauri::{AppHandle, Manager, State};

pub struct MinerContext {
    process: Child,
    stdout_thread: Option<JoinHandle<()>>,
    stderr_thread: Option<JoinHandle<()>>,
}

pub struct MinerState {
    context: Mutex<Option<MinerContext>>,
}

#[derive(Clone, serde::Serialize)]
pub struct MinerOutput {
    message: String,
}

pub fn setup_miner(app: AppHandle) -> () {
    app.manage(MinerState {
        context: Mutex::new(None)
    });
}

#[tauri::command]
pub fn is_miner_running(miner_state: State<MinerState>) -> bool {
    let context = miner_state.context.lock().unwrap();

    match *context {
        Some(_) => true,
        None => false
    }
}

#[tauri::command]
pub fn stop_miner(miner_state: State<MinerState>) -> Result<(), String> {
    let mut context = miner_state.context.lock().unwrap();

    *context = match context.as_mut() {
        None => None,
        Some(c) => {
            c.process.kill().expect("Unable to kill process");

            if let Some(handle) = c.stdout_thread.take() {
                handle.join().unwrap();
            }

            if let Some(handle) = c.stderr_thread.take() {
                handle.join().unwrap();
            }

            None
        }
    };

    Ok(())
}

#[tauri::command]
pub fn run_miner(path: String, args: String, miner_state: State<MinerState>, app: AppHandle) -> Result<(), String> {
    let mut context = miner_state.context.lock().unwrap();

    let mut child = Command::new(path)
        .arg(args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("Could not execute miner");

    let stdout = child.stdout.take().unwrap();
    let stderr = child.stderr.take().unwrap();
    let h1 = app.app_handle();
    let h2 = app.app_handle();

    let stdout_thread = thread::spawn(|| {
        stream_output(stdout, h1);
    });

    let stderr_thread = thread::spawn(|| {
        stream_output(stderr, h2);
    });

    *context = Some(MinerContext {
        process: child,
        stdout_thread: Some(stdout_thread),
        stderr_thread: Some(stderr_thread),
    });

    Ok(())
}

fn stream_output<T: Read>(output: T, handle: AppHandle) {
    let mut reader = BufReader::new(output);
    let mut buffer = String::new();

    while let Ok(n) = reader.read_line(&mut buffer) {
        if n > 0 {
            handle.emit_all("miner-output", MinerOutput {
                message: buffer.clone(),
            }).unwrap();
            buffer.clear();
        } else {
            break;
        }
    }
}
