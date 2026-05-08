# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\menubar\electron-sandbox\menubarService.ts
# Merge Date: 2026-05-07T19:24:54.912464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMenubarService } from '../../../../platform/menubar/electron-sandbox/menubar.js';
import { registerMainProcessRemoteService } from '../../../../platform/ipc/electron-sandbox/services.js';

registerMainProcessRemoteService(IMenubarService, 'menubar');
