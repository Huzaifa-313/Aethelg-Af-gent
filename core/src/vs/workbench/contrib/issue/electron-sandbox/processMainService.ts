# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\issue\electron-sandbox\processMainService.ts
# Merge Date: 2026-05-07T19:24:12.288946
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-sandbox/services.js';
import { IProcessMainService } from '../../../../platform/process/common/process.js';

registerMainProcessRemoteService(IProcessMainService, 'process');

