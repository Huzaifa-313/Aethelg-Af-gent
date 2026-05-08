# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\utils\cancellation.ts
# Merge Date: 2026-05-07T19:22:29.573375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

const noopDisposable = vscode.Disposable.from();

export const nulToken: vscode.CancellationToken = {
	isCancellationRequested: false,
	onCancellationRequested: () => noopDisposable
};
