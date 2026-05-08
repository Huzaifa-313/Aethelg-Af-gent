# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\emmet\src\browser\emmetBrowserMain.ts
# Merge Date: 2026-05-07T19:22:02.533317
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { activateEmmetExtension } from '../emmetCommon';

export function activate(context: vscode.ExtensionContext) {
	activateEmmetExtension(context);
}
