# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\browser\viewModel\viewContext.ts
# Merge Date: 2026-05-07T19:24:19.599945
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBaseCellEditorOptions } from '../notebookBrowser.js';
import { NotebookEventDispatcher } from './eventDispatcher.js';
import { NotebookOptions } from '../notebookOptions.js';

export class ViewContext {
	constructor(
		readonly notebookOptions: NotebookOptions,
		readonly eventDispatcher: NotebookEventDispatcher,
		readonly getBaseCellEditorOptions: (language: string) => IBaseCellEditorOptions
	) {
	}
}
