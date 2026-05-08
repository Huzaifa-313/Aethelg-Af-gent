# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\commands\toggleLock.ts
# Merge Date: 2026-05-07T19:22:14.458308
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Command } from '../commandManager';
import { MarkdownPreviewManager } from '../preview/previewManager';

export class ToggleLockCommand implements Command {
	public readonly id = 'markdown.preview.toggleLock';

	public constructor(
		private readonly _previewManager: MarkdownPreviewManager
	) { }

	public execute() {
		this._previewManager.toggleLock();
	}
}
