# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: rust\crates\openjarvis-learning\src\optimize\mod.rs
# Merge Date: 2026-05-07T19:12:09.339454
# ---

//! Optimization framework for OpenJarvis configuration tuning.
//!
//! Provides LLM-guided search over the 5-primitive configuration space,
//! with SQLite-backed trial persistence and Pareto frontier computation.

pub mod engine;
pub mod llm_optimizer;
pub mod search_space;
pub mod store;
pub mod types;

// Re-export key types for convenience.
pub use engine::{compute_pareto_frontier, OptimizationEngine, TrialRunner};
pub use llm_optimizer::{LLMOptimizer, OptimizerBackend};
pub use search_space::{build_search_space, default_search_space};
pub use store::OptimizationStore;
pub use types::{
    BenchmarkScore, DimensionType, Direction, ObjectiveSpec, OptimizationRun, RunStatus,
    SampleScore, SearchDimension, SearchSpace, TrialConfig, TrialFeedback, TrialResult,
};
