# AETHELGARD MERGED FILE
# Origin Repository: PikoClaw
# Original Path: crates\piko-mcp\src\server_config.rs
# Merge Date: 2026-05-07T19:26:00.705910
# ---

use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct McpServerConfig {
    pub name: String,
    pub transport: McpTransportConfig,
}

#[derive(Debug, Clone)]
pub enum McpTransportConfig {
    Stdio {
        command: String,
        args: Vec<String>,
        env: Option<HashMap<String, String>>,
    },
    Sse {
        url: String,
    },
}
