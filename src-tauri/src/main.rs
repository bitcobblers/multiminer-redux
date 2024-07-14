// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_log::{self, LogTarget};

mod extract;
mod logging;
mod miner;

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(|app| {
            miner::setup_miner(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            extract::arrange_miner_files,
            extract::download_file,
            extract::extract_zip,
            miner::is_miner_running,
            miner::run_miner,
            miner::stop_miner,
            logging::open_folder,
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::Stdout, LogTarget::LogDir])
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
