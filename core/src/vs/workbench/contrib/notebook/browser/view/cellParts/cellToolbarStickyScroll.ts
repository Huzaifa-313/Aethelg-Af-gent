# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\browser\view\cellParts\cellToolbarStickyScroll.ts
# Merge Date: 2026-05-07T19:24:18.756965
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../../base/common/lifecycle.js';
import { clamp } from '../../../../../../base/common/numbers.js';
import { ICellViewModel, INotebookEditor } from '../../notebookBrowser.js';

export function registerCellToolbarStickyScroll(notebookEditor: INotebookEditor, cell: ICellViewModel, element: HTMLElement, opts?: { extraOffset?: number; min?: number }): IDisposable {
	const extraOffset = opts?.extraOffset ?? 0;
	const min = opts?.min ?? 0;

	const updateForScroll = () => {
		if (cell.isInputCollapsed) {
			element.style.top = '';
		} else {
			const scrollTop = notebookEditor.scrollTop;
			const elementTop = notebookEditor.getAbsoluteTopOfElement(cell);
			const diff = scrollTop - elementTop + extraOffset;
			const maxTop = cell.layoutInfo.editorHeight + cell.layoutInfo.statusBarHeight - 45; // subtract roughly the height of the execution order label plus padding
			const top = maxTop > 20 ? // Don't move the run button if it can only move a very short distance
				clamp(min, diff, maxTop) :
				min;
			element.style.top = `${top}px`;
		}
	};

	updateForScroll();
	return notebookEditor.onDidScroll(() => updateForScroll());
}
