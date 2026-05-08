# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.treeViewReveal.d.ts
# Merge Date: 2026-05-07T19:25:06.445463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/61313 @alexr00

	export interface TreeView<T> extends Disposable {
		reveal(element: T | undefined, options?: { select?: boolean; focus?: boolean; expand?: boolean | number }): Thenable<void>;
	}
}
