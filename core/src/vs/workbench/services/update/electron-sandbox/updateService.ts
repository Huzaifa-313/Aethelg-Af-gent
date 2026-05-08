# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\update\electron-sandbox\updateService.ts
# Merge Date: 2026-05-07T19:25:00.506466
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUpdateService } from '../../../../platform/update/common/update.js';
import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-sandbox/services.js';
import { UpdateChannelClient } from '../../../../platform/update/common/updateIpc.js';

registerMainProcessRemoteService(IUpdateService, 'update', { channelClientCtor: UpdateChannelClient });
