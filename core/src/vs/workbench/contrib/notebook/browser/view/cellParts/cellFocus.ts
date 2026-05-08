# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\browser\view\cellParts\cellFocus.ts
# Merge Date: 2026-05-07T19:24:18.599966
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { INotebookEditor } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';

export class CellFocusPart extends CellContentPart {
	constructor(
		containerElement: HTMLElement,
		focusSinkElement: HTMLElement | undefined,
		notebookEditor: INotebookEditor
	) {
		super();

		this._register(DOM.addDisposableListener(containerElement, DOM.EventType.FOCUS, () => {
			if (this.currentCell) {
				notebookEditor.focusElement(this.currentCell);
			}
		}, true));

		if (focusSinkElement) {
			this._register(DOM.addDisposableListener(focusSinkElement, DOM.EventType.FOCUS, () => {
				if (this.currentCell && (this.currentCell as CodeCellViewModel).outputsViewModels.length) {
					notebookEditor.focusNotebookCell(this.currentCell, 'output');
				}
			}));
		}
	}
}
