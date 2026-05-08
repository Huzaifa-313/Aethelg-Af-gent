# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: Fyin-main\src\pretty_print.rs
# Merge Date: 2026-05-07T19:29:35.768176
# ---

use owo_colors::OwoColorize;

pub fn print_green(s: &str) {
    println!("{}", s.green().to_string());
}

pub fn print_red(s: &str) {
    println!("{}", s.red().to_string());
}

pub fn print_blue(s: &str) {
    println!("{}", s.blue().to_string());
}

pub fn print_yellow(s: &str) {
    println!("{}", s.yellow().to_string());
}


