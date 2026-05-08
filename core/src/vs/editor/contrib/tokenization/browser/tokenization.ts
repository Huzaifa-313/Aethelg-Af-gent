# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\contrib\tokenization\browser\tokenization.ts
# Merge Date: 2026-05-07T19:23:12.794898
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import * as nls from '../../../../nls.js';

class ForceRetokenizeAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.forceRetokenize',
			label: nls.localize2('forceRetokenize', "Developer: Force Retokenize"),
			precondition: undefined
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}
		const model = editor.getModel();
		model.tokenization.resetTokenization();
		const sw = new StopWatch();
		model.tokenization.forceTokenization(model.getLineCount());
		sw.stop();
		console.log(`tokenization took ${sw.elapsed()}`);

	}
}

registerEditorAction(ForceRetokenizeAction);
