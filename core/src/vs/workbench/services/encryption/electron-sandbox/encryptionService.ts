# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\encryption\electron-sandbox\encryptionService.ts
# Merge Date: 2026-05-07T19:24:50.178466
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-sandbox/services.js';
import { IEncryptionService } from '../../../../platform/encryption/common/encryptionService.js';

registerMainProcessRemoteService(IEncryptionService, 'encryption');
