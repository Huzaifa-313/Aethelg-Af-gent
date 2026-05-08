# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\commands\selectTypeScriptVersion.ts
# Merge Date: 2026-05-07T19:22:27.106375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import TypeScriptServiceClientHost from '../typeScriptServiceClientHost';
import { Lazy } from '../utils/lazy';
import { Command } from './commandManager';

export class SelectTypeScriptVersionCommand implements Command {
	public static readonly id = 'typescript.selectTypeScriptVersion';
	public readonly id = SelectTypeScriptVersionCommand.id;

	public constructor(
		private readonly lazyClientHost: Lazy<TypeScriptServiceClientHost>
	) { }

	public execute() {
		this.lazyClientHost.value.serviceClient.showVersionPicker();
	}
}
