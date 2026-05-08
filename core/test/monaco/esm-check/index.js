# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: test\monaco\esm-check\index.js
# Merge Date: 2026-05-07T19:25:07.978465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// eslint-disable-next-line local/code-no-standalone-editor
import * as monaco from './out/vs/editor/editor.main.js';

monaco.editor.create(document.getElementById('container'), {
	value: 'Hello world'
});
