use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            // ウィンドウに「常に再描画が必要だ」と思わせる（強硬手段）
            let _ = window.set_shadow(false);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
