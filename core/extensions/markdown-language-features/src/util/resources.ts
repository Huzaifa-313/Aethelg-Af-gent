# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\util\resources.ts
# Merge Date: 2026-05-07T19:22:15.472304
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface WebviewResourceProvider {
	asWebviewUri(resource: vscode.Uri): vscode.Uri;

	readonly cspSource: string;
}

