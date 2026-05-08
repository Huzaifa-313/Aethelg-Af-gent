# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\commands\reloadPlugins.ts
# Merge Date: 2026-05-07T19:22:14.382306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command } from '../commandManager';
import { MarkdownItEngine } from '../markdownEngine';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class ReloadPlugins implements Command {
	public readonly id = 'markdown.api.reloadPlugins';

	public constructor(
		private readonly _webviewManager: MarkdownPreviewManager,
		private readonly _engine: MarkdownItEngine,
	) { }

	public execute(): void {
		this._engine.reloadPlugins();
		this._engine.cleanCache();
		this._webviewManager.refresh();
	}
}
