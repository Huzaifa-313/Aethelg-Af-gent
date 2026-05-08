# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminalContrib\stickyScroll\browser\terminal.stickyScroll.contribution.ts
# Merge Date: 2026-05-07T19:24:39.364478
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/stickyScroll.css';
import { localize, localize2 } from '../../../../../nls.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { registerTerminalAction } from '../../../terminal/browser/terminalActions.js';
import { registerTerminalContribution } from '../../../terminal/browser/terminalExtensions.js';
import { TerminalStickyScrollContribution } from './terminalStickyScrollContribution.js';
import { TerminalStickyScrollSettingId } from '../common/terminalStickyScrollConfiguration.js';

// #region Terminal Contributions

registerTerminalContribution(TerminalStickyScrollContribution.ID, TerminalStickyScrollContribution);

// #endregion

// #region Actions

const enum TerminalStickyScrollCommandId {
	ToggleStickyScroll = 'workbench.action.terminal.toggleStickyScroll',
}

registerTerminalAction({
	id: TerminalStickyScrollCommandId.ToggleStickyScroll,
	title: localize2('workbench.action.terminal.toggleStickyScroll', 'Toggle Sticky Scroll'),
	toggled: {
		condition: ContextKeyExpr.equals(`config.${TerminalStickyScrollSettingId.Enabled}`, true),
		title: localize('stickyScroll', "Sticky Scroll"),
		mnemonicTitle: localize({ key: 'miStickyScroll', comment: ['&& denotes a mnemonic'] }, "&&Sticky Scroll"),
	},
	run: (c, accessor) => {
		const configurationService = accessor.get(IConfigurationService);
		const newValue = !configurationService.getValue(TerminalStickyScrollSettingId.Enabled);
		return configurationService.updateValue(TerminalStickyScrollSettingId.Enabled, newValue);
	},
	menu: [
		{ id: MenuId.TerminalStickyScrollContext }
	]
});

// #endregion

// #region Colors

import './terminalStickyScrollColorRegistry.js';

// #endregion
