# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\tsServer\logDirectoryProvider.ts
# Merge Date: 2026-05-07T19:22:29.045376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface ILogDirectoryProvider {
	getNewLogDirectory(): vscode.Uri | undefined;
}

export const noopLogDirectoryProvider = new class implements ILogDirectoryProvider {
	public getNewLogDirectory(): undefined {
		return undefined;
	}
};
