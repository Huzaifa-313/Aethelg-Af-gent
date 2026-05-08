# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\snippets\browser\snippets.ts
# Merge Date: 2026-05-07T19:24:32.585462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { SnippetFile, Snippet } from './snippetsFile.js';

export const ISnippetsService = createDecorator<ISnippetsService>('snippetService');

export interface ISnippetGetOptions {
	includeDisabledSnippets?: boolean;
	includeNoPrefixSnippets?: boolean;
	noRecencySort?: boolean;
	fileTemplateSnippets?: boolean;
}

export interface ISnippetsService {

	readonly _serviceBrand: undefined;

	getSnippetFiles(): Promise<Iterable<SnippetFile>>;

	isEnabled(snippet: Snippet): boolean;

	updateEnablement(snippet: Snippet, enabled: boolean): void;

	updateUsageTimestamp(snippet: Snippet): void;

	getSnippets(languageId: string | undefined, opt?: ISnippetGetOptions): Promise<Snippet[]>;

	getSnippetsSync(languageId: string, opt?: ISnippetGetOptions): Snippet[];
}
