# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.quickPickSortByLabel.d.ts
# Merge Date: 2026-05-07T19:25:05.808461
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/73904

	export interface QuickPick<T extends QuickPickItem> extends QuickInput {
		/**
		 * An optional flag to sort the final results by index of first query match in label. Defaults to true.
		 */
		// @API is a bug that we need this API at all. why do we change the sort order
		// when extensions give us a (sorted) array of items?
		// @API sortByLabel isn't a great name
		sortByLabel: boolean;
	}
}
