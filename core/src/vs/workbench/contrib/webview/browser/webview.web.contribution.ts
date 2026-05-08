# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\webview\browser\webview.web.contribution.ts
# Merge Date: 2026-05-07T19:24:45.628468
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWebviewService } from './webview.js';
import { WebviewService } from './webviewService.js';

registerSingleton(IWebviewService, WebviewService, InstantiationType.Delayed);
