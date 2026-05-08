# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: cli\src\desktop.rs
# Merge Date: 2026-05-07T19:21:57.832306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

mod version_manager;

pub use version_manager::{prompt_to_install, CodeVersionManager, RequestedVersion};
