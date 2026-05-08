# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\commands\configurePlugin.ts
# Merge Date: 2026-05-07T19:22:26.995375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { PluginManager } from '../tsServer/plugins';
import { Command } from './commandManager';

export class ConfigurePluginCommand implements Command {
	public readonly id = '_typescript.configurePlugin';

	public constructor(
		private readonly pluginManager: PluginManager,
	) { }

	public execute(pluginId: string, configuration: any) {
		this.pluginManager.setConfiguration(pluginId, configuration);
	}
}
