# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\types\textDocument.ts
# Merge Date: 2026-05-07T19:22:15.245306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

/**
 * Minimal version of {@link vscode.TextDocument}.
 */
export interface ITextDocument {
	readonly uri: vscode.Uri;
	readonly version: number;

	getText(range?: vscode.Range): string;

	positionAt(offset: number): vscode.Position;
}

