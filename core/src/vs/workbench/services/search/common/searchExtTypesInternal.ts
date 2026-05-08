# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\search\common\searchExtTypesInternal.ts
# Merge Date: 2026-05-07T19:24:56.234468
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { FileSearchProviderFolderOptions, FileSearchProviderOptions, TextSearchProviderFolderOptions, TextSearchProviderOptions } from './searchExtTypes.js';

interface RipgrepSearchOptionsCommon {
	numThreads?: number;
}

export type TextSearchProviderOptionsRipgrep = Omit<Partial<TextSearchProviderOptions>, 'folderOptions'> & {
	folderOptions: TextSearchProviderFolderOptions;
};

export type FileSearchProviderOptionsRipgrep = & {
	folderOptions: FileSearchProviderFolderOptions;
} & FileSearchProviderOptions;

export interface RipgrepTextSearchOptions extends TextSearchProviderOptionsRipgrep, RipgrepSearchOptionsCommon { }

export interface RipgrepFileSearchOptions extends FileSearchProviderOptionsRipgrep, RipgrepSearchOptionsCommon { }
