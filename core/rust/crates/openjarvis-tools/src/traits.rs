# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: rust\crates\openjarvis-tools\src\traits.rs
# Merge Date: 2026-05-07T19:12:10.465458
# ---

//! BaseTool trait — interface for all tool implementations.

use openjarvis_core::{ToolResult, ToolSpec};
use serde_json::Value;

/// Base trait for all tools.
pub trait BaseTool: Send + Sync {
    fn tool_id(&self) -> &str;
    fn spec(&self) -> &ToolSpec;
    fn execute(&self, params: &Value) -> Result<ToolResult, openjarvis_core::OpenJarvisError>;

    /// Convert to OpenAI function calling format.
    fn to_openai_function(&self) -> Value {
        let spec = self.spec();
        serde_json::json!({
            "type": "function",
            "function": {
                "name": spec.name,
                "description": spec.description,
                "parameters": spec.parameters,
            }
        })
    }
}
