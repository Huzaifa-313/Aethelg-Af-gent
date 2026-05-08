# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: test\automation\src\localization.ts
# Merge Date: 2026-05-07T19:25:06.892465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Code } from './code';
import { ILocalizedStrings, ILocaleInfo } from './driver';

export class Localization {
	constructor(private code: Code) { }

	async getLocaleInfo(): Promise<ILocaleInfo> {
		return this.code.getLocaleInfo();
	}

	async getLocalizedStrings(): Promise<ILocalizedStrings> {
		return this.code.getLocalizedStrings();
	}
}
