# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.textSearchComplete2.d.ts
# Merge Date: 2026-05-07T19:25:06.302465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	export interface TextSearchComplete2 {
		/**
		 * Additional information regarding the state of the completed search.
		 *
		 * Messages with "Information" style support links in markdown syntax:
		 * - Click to [run a command](command:workbench.action.OpenQuickPick)
		 * - Click to [open a website](https://aka.ms)
		 *
		 * Commands may optionally return { triggerSearch: true } to signal to the editor that the original search should run be again.
		 */
		message?: TextSearchCompleteMessage2[];
	}

	/**
	 * A message regarding a completed search.
	 */
	export interface TextSearchCompleteMessage2 {
		/**
		 * Markdown text of the message.
		 */
		text: string;
		/**
		 * Whether the source of the message is trusted, command links are disabled for untrusted message sources.
		 * Messaged are untrusted by default.
		 */
		trusted?: boolean;
		/**
		 * The message type, this affects how the message will be rendered.
		 */
		type: TextSearchCompleteMessageType;
	}
}
