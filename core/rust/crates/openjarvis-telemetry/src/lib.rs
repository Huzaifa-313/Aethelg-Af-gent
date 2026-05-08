# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: rust\crates\openjarvis-telemetry\src\lib.rs
# Merge Date: 2026-05-07T19:12:10.284453
# ---

//! Telemetry — InstrumentedEngine, TelemetryStore, energy monitoring.

pub mod aggregator;
pub mod energy;
pub mod flops;
pub mod instrumented;
pub mod itl;
pub mod phase;
pub mod session;
pub mod store;

pub use aggregator::TelemetryAggregator;
pub use instrumented::InstrumentedEngine;
pub use store::TelemetryStore;
