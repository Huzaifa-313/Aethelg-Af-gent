# AETHELGARD MERGED FILE
# Origin Repository: PikoClaw
# Original Path: crates\piko-tui\src\widgets\input_bar.rs
# Merge Date: 2026-05-07T19:26:03.011911
# ---

use ratatui::{
    layout::Rect,
    widgets::{Block, Borders, Paragraph, Wrap},
    Frame,
};

pub struct InputBar;

impl InputBar {
    pub fn render(frame: &mut Frame, area: Rect, input: &str, cursor_pos: usize) {
        let display = format!("> {}{}", &input[..cursor_pos], &input[cursor_pos..]);
        let widget = Paragraph::new(display)
            .block(Block::default().borders(Borders::ALL))
            .wrap(Wrap { trim: false });
        frame.render_widget(widget, area);
    }
}
