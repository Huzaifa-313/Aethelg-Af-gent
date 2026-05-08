# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\webviewView\browser\webviewView.contribution.ts
# Merge Date: 2026-05-07T19:24:46.220464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWebviewViewService, WebviewViewService } from './webviewViewService.js';

registerSingleton(IWebviewViewService, WebviewViewService, InstantiationType.Delayed);
