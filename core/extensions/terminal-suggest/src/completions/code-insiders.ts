# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\terminal-suggest\src\completions\code-insiders.ts
# Merge Date: 2026-05-07T19:22:25.013378
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import code from './code';

const codeInsidersCompletionSpec: Fig.Spec = {
	...code,
	name: 'code-insiders',
};

export default codeInsidersCompletionSpec;
