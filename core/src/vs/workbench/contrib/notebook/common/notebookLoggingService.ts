# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\common\notebookLoggingService.ts
# Merge Date: 2026-05-07T19:24:20.255946
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const INotebookLoggingService = createDecorator<INotebookLoggingService>('INotebookLoggingService');

export interface INotebookLoggingService {
	readonly _serviceBrand: undefined;
	info(category: string, output: string): void;
	warn(category: string, output: string): void;
	error(category: string, output: string): void;
	debug(category: string, output: string): void;
}
