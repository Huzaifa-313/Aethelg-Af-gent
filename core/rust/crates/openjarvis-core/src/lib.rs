# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: rust\crates\openjarvis-core\src\lib.rs
# Merge Date: 2026-05-07T19:12:08.514456
# ---

//! OpenJarvis Core — foundation types, registry, config, and event bus.
//!
//! This crate provides the shared data types, configuration loading,
//! component registry, and event bus used by all other OpenJarvis crates.

pub mod config;
pub mod error;
pub mod events;
pub mod hardware;
pub mod model_catalog;
pub mod registry;
pub mod types;

pub use config::{load_config, JarvisConfig};
pub use error::OpenJarvisError;
pub use events::{Event, EventBus, EventType};
pub use model_catalog::{merge_discovered_models, register_builtin_models, BUILTIN_MODELS};
pub use registry::TypedRegistry;
pub use types::*;
