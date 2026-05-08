# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\utils\relativePathResolver.ts
# Merge Date: 2026-05-07T19:22:29.735376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import * as vscode from 'vscode';

export class RelativeWorkspacePathResolver {
	public static asAbsoluteWorkspacePath(relativePath: string): string | undefined {
		for (const root of vscode.workspace.workspaceFolders || []) {
			const rootPrefixes = [`./${root.name}/`, `${root.name}/`, `.\\${root.name}\\`, `${root.name}\\`];
			for (const rootPrefix of rootPrefixes) {
				if (relativePath.startsWith(rootPrefix)) {
					return path.join(root.uri.fsPath, relativePath.replace(rootPrefix, ''));
				}
			}
		}

		return undefined;
	}
}
