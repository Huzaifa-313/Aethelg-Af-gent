# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminal\browser\terminalKeybindings.ts
# Merge Date: 2026-05-07T19:24:35.210470
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { IKeybindings, KeybindingWeight, KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { TerminalCommandId } from '../common/terminal.js';
import { TerminalContextKeys } from '../common/terminalContextKey.js';
import { terminalSendSequenceCommand } from './terminalActions.js';

export function registerSendSequenceKeybinding(text: string, rule: { when?: ContextKeyExpression } & IKeybindings): void {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: TerminalCommandId.SendSequence,
		weight: KeybindingWeight.WorkbenchContrib,
		when: rule.when || TerminalContextKeys.focus,
		primary: rule.primary,
		mac: rule.mac,
		linux: rule.linux,
		win: rule.win,
		handler: terminalSendSequenceCommand,
		args: { text }
	});
}
