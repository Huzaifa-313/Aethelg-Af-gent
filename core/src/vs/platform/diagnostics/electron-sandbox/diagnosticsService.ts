# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\diagnostics\electron-sandbox\diagnosticsService.ts
# Merge Date: 2026-05-07T19:23:27.866949
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDiagnosticsService } from '../common/diagnostics.js';
import { registerSharedProcessRemoteService } from '../../ipc/electron-sandbox/services.js';

registerSharedProcessRemoteService(IDiagnosticsService, 'diagnostics');
