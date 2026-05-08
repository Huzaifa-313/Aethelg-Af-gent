# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\localHistory\browser\localHistory.contribution.ts
# Merge Date: 2026-05-07T19:24:12.536951
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './localHistoryCommands.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { LocalHistoryTimeline } from './localHistoryTimeline.js';

// Register Local History Timeline
registerWorkbenchContribution2(LocalHistoryTimeline.ID, LocalHistoryTimeline, WorkbenchPhase.BlockRestore /* registrations only */);
