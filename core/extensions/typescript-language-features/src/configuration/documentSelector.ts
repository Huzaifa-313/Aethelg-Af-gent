# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\configuration\documentSelector.ts
# Merge Date: 2026-05-07T19:22:27.208377
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface DocumentSelector {
	/**
	 * Selector for files which only require a basic syntax server.
	 */
	readonly syntax: readonly vscode.DocumentFilter[];

	/**
	 * Selector for files which require semantic server support.
	 */
	readonly semantic: readonly vscode.DocumentFilter[];
}
