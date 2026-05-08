# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\webview\electron-sandbox\webview.contribution.ts
# Merge Date: 2026-05-07T19:24:45.900463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWebviewService } from '../browser/webview.js';
import * as webviewCommands from './webviewCommands.js';
import { ElectronWebviewService } from './webviewService.js';

registerSingleton(IWebviewService, ElectronWebviewService, InstantiationType.Delayed);

registerAction2(webviewCommands.OpenWebviewDeveloperToolsAction);
