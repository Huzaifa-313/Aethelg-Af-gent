# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\webview\electron-sandbox\webviewService.ts
# Merge Date: 2026-05-07T19:24:45.962464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWebviewElement, WebviewInitInfo } from '../browser/webview.js';
import { WebviewService } from '../browser/webviewService.js';
import { ElectronWebviewElement } from './webviewElement.js';

export class ElectronWebviewService extends WebviewService {

	override createWebviewElement(initInfo: WebviewInitInfo): IWebviewElement {
		const webview = this._instantiationService.createInstance(ElectronWebviewElement, initInfo, this._webviewThemeDataProvider);
		this.registerNewWebview(webview);
		return webview;
	}
}
