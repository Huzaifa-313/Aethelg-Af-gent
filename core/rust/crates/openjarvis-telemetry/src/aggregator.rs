# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: rust\crates\openjarvis-telemetry\src\aggregator.rs
# Merge Date: 2026-05-07T19:12:10.209467
# ---

//! TelemetryAggregator — read-only SQL aggregation queries.

use crate::store::TelemetryStore;
use openjarvis_core::OpenJarvisError;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct AggregateStats {
    pub total_requests: usize,
    pub total_tokens: i64,
    pub avg_latency: f64,
    pub avg_throughput: f64,
    pub total_cost: f64,
    pub total_energy: f64,
}

pub struct TelemetryAggregator;

impl TelemetryAggregator {
    pub fn stats(_store: &TelemetryStore) -> Result<AggregateStats, OpenJarvisError> {
        Ok(AggregateStats::default())
    }
}
