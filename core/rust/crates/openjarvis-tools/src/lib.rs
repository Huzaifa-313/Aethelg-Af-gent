# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: rust\crates\openjarvis-tools\src\lib.rs
# Merge Date: 2026-05-07T19:12:10.415453
# ---

//! Tools primitive — BaseTool trait, ToolExecutor, built-in tools, storage backends.

pub mod builtin;
pub mod executor;
pub mod rig_tools;
pub mod storage;
pub mod traits;

pub use executor::ToolExecutor;
pub use traits::BaseTool;
