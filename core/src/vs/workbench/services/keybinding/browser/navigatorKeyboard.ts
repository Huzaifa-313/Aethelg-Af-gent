# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\keybinding\browser\navigatorKeyboard.ts
# Merge Date: 2026-05-07T19:24:52.579464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IKeyboard {
	getLayoutMap(): Promise<Object>;
	lock(keyCodes?: string[]): Promise<void>;
	unlock(): void;
	addEventListener?(type: string, listener: () => void): void;

}
export type INavigatorWithKeyboard = Navigator & {
	keyboard: IKeyboard;
};