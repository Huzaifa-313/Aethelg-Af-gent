# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.scmActionButton.d.ts
# Merge Date: 2026-05-07T19:25:05.862465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	// https://github.com/microsoft/vscode/issues/133935

	export interface SourceControlActionButton {
		command: Command & { shortTitle?: string };
		secondaryCommands?: Command[][];
		enabled: boolean;
	}

	export interface SourceControl {
		actionButton?: SourceControlActionButton;
	}
}
