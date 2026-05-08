# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\test\engine.ts
# Merge Date: 2026-05-07T19:22:15.121306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { MarkdownItEngine } from '../markdownEngine';
import { MarkdownContributionProvider, MarkdownContributions } from '../markdownExtensions';
import { githubSlugifier } from '../slugify';
import { nulLogger } from './nulLogging';

const emptyContributions = new class implements MarkdownContributionProvider {
	readonly extensionUri = vscode.Uri.file('/');
	readonly contributions = MarkdownContributions.Empty;

	private readonly _onContributionsChanged = new vscode.EventEmitter<this>();
	readonly onContributionsChanged = this._onContributionsChanged.event;

	dispose() {
		this._onContributionsChanged.dispose();
	}
};

export function createNewMarkdownEngine(): MarkdownItEngine {
	return new MarkdownItEngine(emptyContributions, githubSlugifier, nulLogger);
}
