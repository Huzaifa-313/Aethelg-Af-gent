# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\vscode-api-tests\src\extension.ts
# Merge Date: 2026-05-07T19:22:30.289377
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export function activate(_context: vscode.ExtensionContext) {
	// Set context as a global as some tests depend on it
	(global as any).testExtensionContext = _context;
}
