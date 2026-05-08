# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.quickDiffProvider.d.ts
# Merge Date: 2026-05-07T19:25:05.752463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/169012

	export namespace window {
		export function registerQuickDiffProvider(selector: DocumentSelector, quickDiffProvider: QuickDiffProvider, label: string, rootUri?: Uri): Disposable;
	}

	interface QuickDiffProvider {
		label?: string;
		readonly visible?: boolean;
	}
}
