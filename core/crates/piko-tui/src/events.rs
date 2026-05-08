# AETHELGARD MERGED FILE
# Origin Repository: PikoClaw
# Original Path: crates\piko-tui\src\events.rs
# Merge Date: 2026-05-07T19:26:02.518912
# ---

use crossterm::event::KeyEvent;
use piko_agent::AgentEvent;
use piko_permissions::checker::{PermissionDecision, PermissionRequest};
use tokio::sync::oneshot;

pub struct PermissionPrompt {
    pub request: PermissionRequest,
    pub reply: oneshot::Sender<PermissionDecision>,
}

pub struct QuestionPrompt {
    pub question: String,
    pub options: Vec<String>,
    pub reply: oneshot::Sender<String>,
}

#[derive(Debug)]
pub enum AppEvent {
    Key(KeyEvent),
    Agent(AgentEvent),
    AgentDone,
    Tick,
    Quit,
}
