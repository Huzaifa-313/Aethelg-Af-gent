# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\profiling\electron-sandbox\profilingService.ts
# Merge Date: 2026-05-07T19:23:33.113948
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSharedProcessRemoteService } from '../../ipc/electron-sandbox/services.js';
import { IV8InspectProfilingService } from '../common/profiling.js';

registerSharedProcessRemoteService(IV8InspectProfilingService, 'v8InspectProfiling');
