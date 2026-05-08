# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminalContrib\zoom\common\terminal.zoom.ts
# Merge Date: 2026-05-07T19:24:42.512483
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IStringDictionary } from '../../../../../base/common/collections.js';
import { isMacintosh } from '../../../../../base/common/platform.js';
import { localize } from '../../../../../nls.js';
import type { IConfigurationPropertySchema } from '../../../../../platform/configuration/common/configurationRegistry.js';

export const enum TerminalZoomCommandId {
	FontZoomIn = 'workbench.action.terminal.fontZoomIn',
	FontZoomOut = 'workbench.action.terminal.fontZoomOut',
	FontZoomReset = 'workbench.action.terminal.fontZoomReset',
}

export const enum TerminalZoomSettingId {
	MouseWheelZoom = 'terminal.integrated.mouseWheelZoom',
}

export const terminalZoomConfiguration: IStringDictionary<IConfigurationPropertySchema> = {
	[TerminalZoomSettingId.MouseWheelZoom]: {
		markdownDescription: isMacintosh
			? localize('terminal.integrated.mouseWheelZoom.mac', "Zoom the font of the terminal when using mouse wheel and holding `Cmd`.")
			: localize('terminal.integrated.mouseWheelZoom', "Zoom the font of the terminal when using mouse wheel and holding `Ctrl`."),
		type: 'boolean',
		default: false
	},
};
