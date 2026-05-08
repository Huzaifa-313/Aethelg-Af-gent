# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\php-language-features\src\features\utils\markedTextUtil.ts
# Merge Date: 2026-05-07T19:22:22.531859
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarkedString } from 'vscode';

export function textToMarkedString(text: string): MarkedString {
	return text.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&'); // escape markdown syntax tokens: http://daringfireball.net/projects/markdown/syntax#backslash
}