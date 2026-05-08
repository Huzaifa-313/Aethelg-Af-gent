# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminal\common\terminalExtensionPoints.contribution.ts
# Merge Date: 2026-05-07T19:24:36.280462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ITerminalContributionService, TerminalContributionService } from './terminalExtensionPoints.js';

registerSingleton(ITerminalContributionService, TerminalContributionService, InstantiationType.Delayed);
