# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\checksum\electron-sandbox\checksumService.ts
# Merge Date: 2026-05-07T19:24:48.372466
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChecksumService } from '../../../../platform/checksum/common/checksumService.js';
import { registerSharedProcessRemoteService } from '../../../../platform/ipc/electron-sandbox/services.js';

registerSharedProcessRemoteService(IChecksumService, 'checksum');
