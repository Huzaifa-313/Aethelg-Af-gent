# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: rust\crates\openjarvis-learning\src\traits.rs
# Merge Date: 2026-05-07T19:12:09.268457
# ---

//! Learning trait definitions.

use openjarvis_core::{OpenJarvisError, RoutingContext};
use openjarvis_traces::TraceStore;
use serde_json::Value;
use std::collections::HashMap;

pub trait RouterPolicy: Send + Sync {
    fn select_model(&self, context: &RoutingContext) -> String;
}

pub trait LearningPolicy: Send + Sync {
    fn target(&self) -> &str;
    fn update(
        &self,
        trace_store: &TraceStore,
    ) -> Result<HashMap<String, Value>, OpenJarvisError>;
}
