# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\util\cancellation.ts
# Merge Date: 2026-05-07T19:22:15.322307
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export const noopToken: vscode.CancellationToken = new class implements vscode.CancellationToken {
	private readonly _onCancellationRequestedEmitter = new vscode.EventEmitter<void>();
	onCancellationRequested = this._onCancellationRequestedEmitter.event;

	get isCancellationRequested() { return false; }
};
