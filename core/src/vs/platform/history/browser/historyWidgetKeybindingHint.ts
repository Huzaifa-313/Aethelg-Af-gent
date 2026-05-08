# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\history\browser\historyWidgetKeybindingHint.ts
# Merge Date: 2026-05-07T19:23:31.126943
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeybindingService } from '../../keybinding/common/keybinding.js';

export function showHistoryKeybindingHint(keybindingService: IKeybindingService): boolean {
	return keybindingService.lookupKeybinding('history.showPrevious')?.getElectronAccelerator() === 'Up' && keybindingService.lookupKeybinding('history.showNext')?.getElectronAccelerator() === 'Down';
}
