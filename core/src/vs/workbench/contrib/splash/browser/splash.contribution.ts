# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\splash\browser\splash.contribution.ts
# Merge Date: 2026-05-07T19:24:33.129465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ISplashStorageService } from './splash.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { PartsSplash } from './partsSplash.js';
import { IPartsSplash } from '../../../../platform/theme/common/themeService.js';

registerSingleton(ISplashStorageService, class SplashStorageService implements ISplashStorageService {
	_serviceBrand: undefined;

	async saveWindowSplash(splash: IPartsSplash): Promise<void> {
		const raw = JSON.stringify(splash);
		localStorage.setItem('monaco-parts-splash', raw);
	}
}, InstantiationType.Delayed);

registerWorkbenchContribution2(
	PartsSplash.ID,
	PartsSplash,
	WorkbenchPhase.BlockStartup
);
