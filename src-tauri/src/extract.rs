use std::fs::File;

use zip::ZipArchive;

#[tauri::command]
pub fn extract_zip(path: String, save_path: String) -> Result<(), String> {
    let reader = File::open(&path)
        .expect("Unable to open archive.");

    let mut archive = ZipArchive::new(reader)
        .expect("Could not read archive contents.");

    ZipArchive::extract(&mut archive, &save_path)
        .expect("Could not extract files.");

    Ok(())
}
