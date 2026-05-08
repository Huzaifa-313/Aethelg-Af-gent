# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\browser\ui\list\splice.ts
# Merge Date: 2026-05-07T19:22:41.727379
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ISpliceable } from '../../../common/sequence.js';

export interface ISpreadSpliceable<T> {
	splice(start: number, deleteCount: number, ...elements: T[]): void;
}

export class CombinedSpliceable<T> implements ISpliceable<T> {

	constructor(private spliceables: ISpliceable<T>[]) { }

	splice(start: number, deleteCount: number, elements: T[]): void {
		this.spliceables.forEach(s => s.splice(start, deleteCount, elements));
	}
}