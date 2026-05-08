# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\scm\common\quickDiff.ts
# Merge Date: 2026-05-07T19:24:28.153463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { LanguageSelector } from '../../../../editor/common/languageSelector.js';
import { Event } from '../../../../base/common/event.js';
import { LineRangeMapping } from '../../../../editor/common/diff/rangeMapping.js';

export const IQuickDiffService = createDecorator<IQuickDiffService>('quickDiff');

export interface QuickDiffProvider {
	label: string;
	rootUri: URI | undefined;
	selector?: LanguageSelector;
	isSCM: boolean;
	visible: boolean;
	getOriginalResource(uri: URI): Promise<URI | null>;
}

export interface QuickDiff {
	label: string;
	originalResource: URI;
	isSCM: boolean;
	visible: boolean;
}

export interface QuickDiffResult {
	readonly original: URI;
	readonly modified: URI;
	readonly changes: readonly LineRangeMapping[];
}

export interface IQuickDiffService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeQuickDiffProviders: Event<void>;
	addQuickDiffProvider(quickDiff: QuickDiffProvider): IDisposable;
	getQuickDiffs(uri: URI, language?: string, isSynchronized?: boolean): Promise<QuickDiff[]>;
}
