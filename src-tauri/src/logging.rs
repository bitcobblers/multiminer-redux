use std::process::Command;

#[tauri::command]
pub fn open_folder(path: String) -> Result<(), String> {
    Command::new("explorer")
        .arg(path)
        .output()
        .map_err(|e| e.to_string())?;

    Ok(())
}
