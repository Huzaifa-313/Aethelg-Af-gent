# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.codeActionRanges.d.ts
# Merge Date: 2026-05-07T19:25:04.526462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface CodeAction {
		/**
		 * The ranges to which this Code Action applies to, which will be highlighted.
		 * For example: A refactoring action will highlight the range of text that will be affected.
		 */
		ranges?: Range[];
	}
}
