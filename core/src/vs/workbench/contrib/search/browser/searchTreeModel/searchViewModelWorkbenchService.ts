# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\search\browser\searchTreeModel\searchViewModelWorkbenchService.ts
# Merge Date: 2026-05-07T19:24:31.530465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../../platform/instantiation/common/instantiation.js';
import { ISearchModel } from './searchTreeCommon.js';

export const ISearchViewModelWorkbenchService = createDecorator<ISearchViewModelWorkbenchService>('searchViewModelWorkbenchService');

export interface ISearchViewModelWorkbenchService {
	readonly _serviceBrand: undefined;

	searchModel: ISearchModel;
}
