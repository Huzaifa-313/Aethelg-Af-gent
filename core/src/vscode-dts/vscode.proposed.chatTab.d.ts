# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.chatTab.d.ts
# Merge Date: 2026-05-07T19:25:04.486463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	/**
	 * The tab represents an interactive window.
	 */
	export class TabInputChat {
		constructor();
	}

	export interface Tab {
		readonly input: TabInputText | TabInputTextDiff | TabInputCustom | TabInputWebview | TabInputNotebook | TabInputNotebookDiff | TabInputTerminal | TabInputChat | unknown;
	}
}
