# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: cli\src\commands.rs
# Merge Date: 2026-05-07T19:21:57.798303
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

mod context;

pub mod args;
pub mod serve_web;
pub mod tunnels;
pub mod update;
pub mod version;
pub use context::CommandContext;
