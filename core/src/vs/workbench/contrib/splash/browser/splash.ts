# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\splash\browser\splash.ts
# Merge Date: 2026-05-07T19:24:33.144465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IPartsSplash } from '../../../../platform/theme/common/themeService.js';

export const ISplashStorageService = createDecorator<ISplashStorageService>('ISplashStorageService');

export interface ISplashStorageService {

	readonly _serviceBrand: undefined;

	saveWindowSplash(splash: IPartsSplash): Promise<void>;
}
