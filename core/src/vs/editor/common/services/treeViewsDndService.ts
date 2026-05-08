# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\common\services\treeViewsDndService.ts
# Merge Date: 2026-05-07T19:23:02.123376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { VSDataTransfer } from '../../../base/common/dataTransfer.js';
import { ITreeViewsDnDService as ITreeViewsDnDServiceCommon, TreeViewsDnDService } from './treeViewsDnd.js';

export interface ITreeViewsDnDService extends ITreeViewsDnDServiceCommon<VSDataTransfer> { }
export const ITreeViewsDnDService = createDecorator<ITreeViewsDnDService>('treeViewsDndService');
registerSingleton(ITreeViewsDnDService, TreeViewsDnDService, InstantiationType.Delayed);
