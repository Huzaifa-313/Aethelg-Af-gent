# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\emmet\src\node\emmetNodeMain.ts
# Merge Date: 2026-05-07T19:22:02.551305
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { homedir } from 'os';

import { activateEmmetExtension } from '../emmetCommon';
import { setHomeDir } from '../util';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('editor.emmet.action.updateImageSize', () => {
		return import('../updateImageSize').then(uis => uis.updateImageSize());
	}));

	setHomeDir(vscode.Uri.file(homedir()));
	activateEmmetExtension(context);
}
