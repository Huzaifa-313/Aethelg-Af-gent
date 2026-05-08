# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\browser\view\cellParts\collapsedCellInput.ts
# Merge Date: 2026-05-07T19:24:18.850965
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { INotebookEditor } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';

export class CollapsedCellInput extends CellContentPart {
	constructor(
		private readonly notebookEditor: INotebookEditor,
		cellInputCollapsedContainer: HTMLElement,
	) {
		super();

		this._register(DOM.addDisposableListener(cellInputCollapsedContainer, DOM.EventType.DBLCLICK, e => {
			if (!this.currentCell || !this.notebookEditor.hasModel()) {
				return;
			}

			if (this.currentCell.isInputCollapsed) {
				this.currentCell.isInputCollapsed = false;
			} else {
				this.currentCell.isOutputCollapsed = false;
			}
		}));

		this._register(DOM.addDisposableListener(cellInputCollapsedContainer, DOM.EventType.CLICK, e => {
			if (!this.currentCell || !this.notebookEditor.hasModel()) {
				return;
			}

			const element = e.target as HTMLElement;

			if (element && element.classList && element.classList.contains('expandInputIcon')) {
				// clicked on the expand icon
				this.currentCell.isInputCollapsed = false;
			}
		}));
	}
}

