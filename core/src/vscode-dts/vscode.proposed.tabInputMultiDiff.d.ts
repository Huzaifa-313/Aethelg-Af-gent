# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.tabInputMultiDiff.d.ts
# Merge Date: 2026-05-07T19:25:06.051466
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/206411

declare module 'vscode' {

	export class TabInputTextMultiDiff {

		readonly textDiffs: TabInputTextDiff[];

		constructor(textDiffs: TabInputTextDiff[]);
	}

	export interface Tab {

		readonly input: TabInputText | TabInputTextDiff | TabInputTextMultiDiff | TabInputCustom | TabInputWebview | TabInputNotebook | TabInputNotebookDiff | TabInputTerminal | unknown;

	}
}
