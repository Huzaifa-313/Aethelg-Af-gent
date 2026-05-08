# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\ipynb\src\ipynbMain.browser.ts
# Merge Date: 2026-05-07T19:22:10.521309
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as main from './ipynbMain';
import { NotebookSerializer } from './notebookSerializer.web';

export function activate(context: vscode.ExtensionContext) {
	return main.activate(context, new NotebookSerializer(context));
}

export function deactivate() {
	return main.deactivate();
}
