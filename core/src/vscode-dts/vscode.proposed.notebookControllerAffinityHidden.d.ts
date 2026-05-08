# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.notebookControllerAffinityHidden.d.ts
# Merge Date: 2026-05-07T19:25:05.572484
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/161144
	export enum NotebookControllerAffinity2 {
		Default = 1,
		Preferred = 2,
		Hidden = -1
	}

	export interface NotebookController {
		updateNotebookAffinity(notebook: NotebookDocument, affinity: NotebookControllerAffinity | NotebookControllerAffinity2): void;
	}
}
