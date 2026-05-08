# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\commands\showPreviewSecuritySelector.ts
# Merge Date: 2026-05-07T19:22:14.429306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { MarkdownPreviewManager } from '../preview/previewManager';
import { PreviewSecuritySelector } from '../preview/security';
import { isMarkdownFile } from '../util/file';

export class ShowPreviewSecuritySelectorCommand implements Command {
	public readonly id = 'markdown.showPreviewSecuritySelector';

	public constructor(
		private readonly _previewSecuritySelector: PreviewSecuritySelector,
		private readonly _previewManager: MarkdownPreviewManager
	) { }

	public execute(resource: string | undefined) {
		if (this._previewManager.activePreviewResource) {
			this._previewSecuritySelector.showSecuritySelectorForResource(this._previewManager.activePreviewResource);
		} else if (resource) {
			const source = vscode.Uri.parse(resource);
			this._previewSecuritySelector.showSecuritySelectorForResource(source.query ? vscode.Uri.parse(source.query) : source);
		} else if (vscode.window.activeTextEditor && isMarkdownFile(vscode.window.activeTextEditor.document)) {
			this._previewSecuritySelector.showSecuritySelectorForResource(vscode.window.activeTextEditor.document.uri);
		}
	}
}
