# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminalContrib\stickyScroll\browser\terminalStickyScrollColorRegistry.ts
# Merge Date: 2026-05-07T19:24:39.377467
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { registerColor } from '../../../../../platform/theme/common/colorUtils.js';

export const terminalStickyScrollBackground = registerColor('terminalStickyScroll.background', null, localize('terminalStickyScroll.background', 'The background color of the sticky scroll overlay in the terminal.'));

export const terminalStickyScrollHoverBackground = registerColor('terminalStickyScrollHover.background', {
	dark: '#2A2D2E',
	light: '#F0F0F0',
	hcDark: '#E48B39',
	hcLight: '#0f4a85'
}, localize('terminalStickyScrollHover.background', 'The background color of the sticky scroll overlay in the terminal when hovered.'));

registerColor('terminalStickyScroll.border', {
	dark: null,
	light: null,
	hcDark: '#6fc3df',
	hcLight: '#0f4a85'
}, localize('terminalStickyScroll.border', 'The border of the sticky scroll overlay in the terminal.'));
