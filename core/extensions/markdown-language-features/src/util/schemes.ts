# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\util\schemes.ts
# Merge Date: 2026-05-07T19:22:15.488305
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const Schemes = Object.freeze({
	http: 'http',
	https: 'https',
	file: 'file',
	untitled: 'untitled',
	mailto: 'mailto',
	vscode: 'vscode',
	'vscode-insiders': 'vscode-insiders',
	notebookCell: 'vscode-notebook-cell',
});

export function isOfScheme(scheme: string, link: string): boolean {
	return link.toLowerCase().startsWith(scheme + ':');
}
