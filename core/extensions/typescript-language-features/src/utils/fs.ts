# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\utils\fs.ts
# Merge Date: 2026-05-07T19:22:29.616385
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export async function exists(resource: vscode.Uri): Promise<boolean> {
	try {
		const stat = await vscode.workspace.fs.stat(resource);
		// stat.type is an enum flag
		return !!(stat.type & vscode.FileType.File);
	} catch {
		return false;
	}
}

export function looksLikeAbsoluteWindowsPath(path: string): boolean {
	return /^[a-zA-Z]:[\/\\]/.test(path);
}
