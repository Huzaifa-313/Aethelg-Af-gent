# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\search\node\textSearchManager.ts
# Merge Date: 2026-05-07T19:24:56.558464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toCanonicalName } from '../../textfile/common/encoding.js';
import * as pfs from '../../../../base/node/pfs.js';
import { ITextQuery, ITextSearchStats } from '../common/search.js';
import { TextSearchProvider2 } from '../common/searchExtTypes.js';
import { TextSearchManager } from '../common/textSearchManager.js';

export class NativeTextSearchManager extends TextSearchManager {

	constructor(query: ITextQuery, provider: TextSearchProvider2, _pfs: typeof pfs = pfs, processType: ITextSearchStats['type'] = 'searchProcess') {
		super({ query, provider }, {
			readdir: resource => _pfs.Promises.readdir(resource.fsPath),
			toCanonicalName: name => toCanonicalName(name)
		}, processType);
	}
}
