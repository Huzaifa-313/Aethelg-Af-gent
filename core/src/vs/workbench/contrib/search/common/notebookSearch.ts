# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\search\common\notebookSearch.ts
# Merge Date: 2026-05-07T19:24:31.656464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ResourceSet } from '../../../../base/common/map.js';
import { ITextQuery, ISearchProgressItem, ISearchComplete } from '../../../services/search/common/search.js';

export const INotebookSearchService = createDecorator<INotebookSearchService>('notebookSearchService');

export interface INotebookSearchService {

	readonly _serviceBrand: undefined;

	notebookSearch(query: ITextQuery, token: CancellationToken | undefined, searchInstanceID: string, onProgress?: (result: ISearchProgressItem) => void): {
		openFilesToScan: ResourceSet;
		completeData: Promise<ISearchComplete>;
		allScannedFiles: Promise<ResourceSet>;
	};
}
