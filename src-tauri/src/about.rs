use tauri::command;

#[command]
pub fn about_get_name() -> String {
    env!("CARGO_PKG_NAME").into()
}

#[command]
pub fn about_get_version() -> String {
    env!("CARGO_PKG_VERSION").into()
}
