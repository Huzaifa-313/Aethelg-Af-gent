# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\api\common\extHostInitDataService.ts
# Merge Date: 2026-05-07T19:23:45.295945
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionHostInitData } from '../../services/extensions/common/extensionHostProtocol.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';

export const IExtHostInitDataService = createDecorator<IExtHostInitDataService>('IExtHostInitDataService');

export interface IExtHostInitDataService extends Readonly<IExtensionHostInitData> {
	readonly _serviceBrand: undefined;
}

