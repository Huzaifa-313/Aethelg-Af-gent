# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminal\browser\terminalCommands.ts
# Merge Date: 2026-05-07T19:24:34.704462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ITerminalGroupService } from './terminal.js';

export function setupTerminalCommands(): void {
	registerOpenTerminalAtIndexCommands();
}

function registerOpenTerminalAtIndexCommands(): void {
	for (let i = 0; i < 9; i++) {
		const terminalIndex = i;
		const visibleIndex = i + 1;

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: `workbench.action.terminal.focusAtIndex${visibleIndex}`,
			weight: KeybindingWeight.WorkbenchContrib,
			when: undefined,
			primary: 0,
			handler: accessor => {
				accessor.get(ITerminalGroupService).setActiveInstanceByIndex(terminalIndex);
				return accessor.get(ITerminalGroupService).showPanel(true);
			}
		});
	}
}
