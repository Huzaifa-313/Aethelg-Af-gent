# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\microsoft-authentication\src\UriEventHandler.ts
# Merge Date: 2026-05-07T19:22:17.996824
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export class UriEventHandler extends vscode.EventEmitter<vscode.Uri> implements vscode.UriHandler {
	private _disposable = vscode.window.registerUriHandler(this);

	handleUri(uri: vscode.Uri) {
		this.fire(uri);
	}

	override dispose(): void {
		super.dispose();
		this._disposable.dispose();
	}
}
