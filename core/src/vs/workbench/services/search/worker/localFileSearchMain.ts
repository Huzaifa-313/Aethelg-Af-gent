# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\search\worker\localFileSearchMain.ts
# Merge Date: 2026-05-07T19:24:57.300465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { bootstrapSimpleWorker } from '../../../../base/common/worker/simpleWorkerBootstrap.js';
import { create } from './localFileSearch.js';

bootstrapSimpleWorker(create);
