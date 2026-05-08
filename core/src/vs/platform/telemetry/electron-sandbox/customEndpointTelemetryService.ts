# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\telemetry\electron-sandbox\customEndpointTelemetryService.ts
# Merge Date: 2026-05-07T19:23:35.448949
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSharedProcessRemoteService } from '../../ipc/electron-sandbox/services.js';
import { ICustomEndpointTelemetryService } from '../common/telemetry.js';

registerSharedProcessRemoteService(ICustomEndpointTelemetryService, 'customEndpointTelemetry');
