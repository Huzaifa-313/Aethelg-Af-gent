# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\keybinding\browser\keyboardLayouts\_.contribution.ts
# Merge Date: 2026-05-07T19:24:53.301462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IKeymapInfo } from '../../common/keymapInfo.js';

export class KeyboardLayoutContribution {
	public static readonly INSTANCE: KeyboardLayoutContribution = new KeyboardLayoutContribution();

	private _layoutInfos: IKeymapInfo[] = [];

	get layoutInfos() {
		return this._layoutInfos;
	}

	private constructor() {
	}

	registerKeyboardLayout(layout: IKeymapInfo) {
		this._layoutInfos.push(layout);
	}
}