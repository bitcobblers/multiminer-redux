// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod about;
mod miner;
mod extract;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            miner::setup_miner(app.handle());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            about::about_get_name,
            about::about_get_version,
            about::about_open_browser,
            extract::extract_zip,
            miner::is_miner_running,
            miner::run_miner,
            miner::stop_miner
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
