// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;

use zip::ZipArchive;

mod about;

#[tauri::command]
fn extract_zip(path: String, save_path: String) -> Result<(), String> {
    let reader = File::open(&path)
        .expect("Unable to open archive.");

    let mut archive = ZipArchive::new(reader)
        .expect("Could not read archive contents.");

    ZipArchive::extract(&mut archive, &save_path)
        .expect("Could not extract files.");

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            about::about_get_name,
            about::about_get_version,
            about::about_open_browser,
            extract_zip,
        ])
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
