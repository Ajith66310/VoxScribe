// src-tauri/src/lib.rs
use tauri::{Manager, Emitter}; // Removed unused AppHandle

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Initialize Single Instance plugin FIRST
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            // Check if a URL was passed as an argument (the deep link)
            if let Some(url) = args.get(1) {
                // Send the URL to the existing frontend listener
                let _ = app.emit("deep-link://new-url", url);
            }
            
            // Bring the main window to focus when the second instance is blocked
            let _ = app.get_webview_window("main")
                .map(|w| w.set_focus());
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            #[cfg(all(desktop, target_os = "windows"))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                // Register the 'voxscribe' scheme in the Windows Registry
                app.deep_link().register_all()?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}