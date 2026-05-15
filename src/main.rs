use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
          
            let _ = window.set_shadow(false);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
