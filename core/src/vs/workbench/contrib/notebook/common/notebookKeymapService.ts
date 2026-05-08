# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\common\notebookKeymapService.ts
# Merge Date: 2026-05-07T19:24:20.240949
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const INotebookKeymapService = createDecorator<INotebookKeymapService>('notebookKeymapService');

export interface INotebookKeymapService {
	readonly _serviceBrand: undefined;
}
