# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\scrollLocking\browser\scrollLocking.contribution.ts
# Merge Date: 2026-05-07T19:24:28.360465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { SyncScroll as ScrollLocking } from './scrollLocking.js';

registerWorkbenchContribution2(
	ScrollLocking.ID,
	ScrollLocking,
	WorkbenchPhase.Eventually // registration only
);
