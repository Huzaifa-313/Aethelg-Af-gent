# AETHELGARD MERGED FILE
# Origin Repository: PikoClaw
# Original Path: crates\piko-tui\src\widgets\chat_pane.rs
# Merge Date: 2026-05-07T19:26:02.988912
# ---

use ratatui::{
    layout::Rect,
    widgets::{Block, Borders, List, ListItem},
    Frame,
};

pub struct ChatPane;

impl ChatPane {
    pub fn render(frame: &mut Frame, area: Rect, items: Vec<ListItem>) {
        let block = Block::default().borders(Borders::ALL).title(" Chat ");
        let list = List::new(items).block(block);
        frame.render_widget(list, area);
    }
}
