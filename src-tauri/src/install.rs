use log::debug;
use std::fs::{read_dir, remove_dir, rename, File};
use std::io::Write;
use std::path::Path;
use zip::ZipArchive;

#[tauri::command]
pub fn extract_zip(path: String, save_path: String) -> Result<(), String> {
    match File::open(path) {
        Ok(reader) => {
            let mut archive = ZipArchive::new(reader).expect("Could not read archive contents.");

            ZipArchive::extract(&mut archive, &save_path).expect("Could not extract files.");
            Ok(())
        }
        Err(e) => Err(format!("Unable to open archive. {}", e)),
    }
}

#[tauri::command]
pub async fn download_file(url: String, save_path: String) -> Result<(), String> {
    let client = reqwest::Client::new();

    let mut response = client
        .get(&url)
        .send()
        .await
        .expect("Could not download file.");

    let mut file = File::create(save_path).expect("Could not create file.");

    while let Some(chunk) = response.chunk().await.expect("Could not read chunk.") {
        file.write_all(&chunk).expect("Could not write chunk.");
    }

    Ok(())
}

#[tauri::command]
pub fn arrange_miner_files(path: String) -> Result<(), String> {
    let root_files: Vec<_> = read_dir(&path)
        .expect("Could not read directory.")
        .map(|entry| entry.unwrap().path())
        .collect();

    if root_files.len() > 1 {
        return Ok(());
    }

    let files_folder = root_files[0].to_owned();
    let files_path = read_dir(&files_folder).expect("Could not read directory.");

    files_path.map(|f| f.unwrap()).for_each(|file| {
        let target_path = Path::new(&path).join(file.file_name());

        debug!("Moving {:?} to {:?}", file.path(), target_path);
        rename(file.path(), target_path).expect("Could not move file.");
    });

    debug!("Deleting {:?}", files_folder);
    remove_dir(files_folder).expect("Could not delete folder.");

    Ok(())
}
