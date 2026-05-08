# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\remoteTunnel\electron-sandbox\remoteTunnelService.ts
# Merge Date: 2026-05-07T19:23:34.347946
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSharedProcessRemoteService } from '../../ipc/electron-sandbox/services.js';
import { IRemoteTunnelService } from '../common/remoteTunnel.js';

registerSharedProcessRemoteService(IRemoteTunnelService, 'remoteTunnel');
