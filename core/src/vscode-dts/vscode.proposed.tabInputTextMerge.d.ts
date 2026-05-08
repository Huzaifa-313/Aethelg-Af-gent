# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.tabInputTextMerge.d.ts
# Merge Date: 2026-05-07T19:25:06.069465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/153213

declare module 'vscode' {

	export class TabInputTextMerge {

		readonly base: Uri;
		readonly input1: Uri;
		readonly input2: Uri;
		readonly result: Uri;

		constructor(base: Uri, input1: Uri, input2: Uri, result: Uri);
	}

	export interface Tab {

		readonly input: TabInputText | TabInputTextDiff | TabInputTextMerge | TabInputCustom | TabInputWebview | TabInputNotebook | TabInputNotebookDiff | TabInputTerminal | unknown;

	}
}
