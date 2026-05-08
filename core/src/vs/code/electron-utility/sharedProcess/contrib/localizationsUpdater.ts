# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\code\electron-utility\sharedProcess\contrib\localizationsUpdater.ts
# Merge Date: 2026-05-07T19:22:53.256377
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILanguagePackService } from '../../../../platform/languagePacks/common/languagePacks.js';
import { NativeLanguagePackService } from '../../../../platform/languagePacks/node/languagePacks.js';

export class LocalizationsUpdater extends Disposable {

	constructor(
		@ILanguagePackService private readonly localizationsService: NativeLanguagePackService
	) {
		super();

		this.updateLocalizations();
	}

	private updateLocalizations(): void {
		this.localizationsService.update();
	}
}
