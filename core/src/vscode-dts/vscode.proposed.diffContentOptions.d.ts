# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.diffContentOptions.d.ts
# Merge Date: 2026-05-07T19:25:05.078467
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// TODO@rebornix: add github issue link

	export interface NotebookDocumentContentOptions {
		/**
		 * Controls if a cell metadata property should be reverted when the cell content
		 * is reverted in notebook diff editor.
		 */
		cellContentMetadata?: { [key: string]: boolean | undefined };
	}
}
