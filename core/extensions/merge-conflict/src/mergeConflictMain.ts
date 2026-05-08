# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\merge-conflict\src\mergeConflictMain.ts
# Merge Date: 2026-05-07T19:22:16.955813
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import MergeConflictServices from './services';

export function activate(context: vscode.ExtensionContext) {
	// Register disposables
	const services = new MergeConflictServices(context);
	services.begin();
	context.subscriptions.push(services);
}

export function deactivate() {
}

