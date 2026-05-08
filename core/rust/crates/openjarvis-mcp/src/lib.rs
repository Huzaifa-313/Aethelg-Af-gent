# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: rust\crates\openjarvis-mcp\src\lib.rs
# Merge Date: 2026-05-07T19:12:09.464456
# ---

//! MCP (Model Context Protocol) — JSON-RPC server/client for tool exposure.

pub mod protocol;
pub mod server;

pub use protocol::{McpRequest, McpResponse};
pub use server::McpServer;
