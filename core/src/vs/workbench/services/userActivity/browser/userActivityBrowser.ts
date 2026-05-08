# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\userActivity\browser\userActivityBrowser.ts
# Merge Date: 2026-05-07T19:25:00.578467
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DomActivityTracker } from './domActivityTracker.js';
import { userActivityRegistry } from '../common/userActivityRegistry.js';

userActivityRegistry.add(DomActivityTracker);
