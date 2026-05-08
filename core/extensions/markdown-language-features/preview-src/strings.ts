# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\preview-src\strings.ts
# Merge Date: 2026-05-07T19:22:13.912304
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getStrings(): { [key: string]: string } {
	const store = document.getElementById('vscode-markdown-preview-data');
	if (store) {
		const data = store.getAttribute('data-strings');
		if (data) {
			return JSON.parse(data);
		}
	}
	throw new Error('Could not load strings');
}
