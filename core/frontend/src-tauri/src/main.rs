# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: frontend\src-tauri\src\main.rs
# Merge Date: 2026-05-07T19:12:08.053456
# ---

// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    openjarvis_desktop::run();
}
