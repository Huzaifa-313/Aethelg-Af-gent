# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: cli\src\commands\context.rs
# Merge Date: 2026-05-07T19:21:58.176307
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

use crate::{log, state::LauncherPaths};

use super::args::CliCore;

pub struct CommandContext {
	pub log: log::Logger,
	pub paths: LauncherPaths,
	pub args: CliCore,
	pub http: reqwest::Client,
}
