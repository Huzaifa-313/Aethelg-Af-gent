# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\profiling\electron-sandbox\profileAnalysisWorkerMain.ts
# Merge Date: 2026-05-07T19:23:33.082945
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { create } from './profileAnalysisWorker.js';
import { bootstrapSimpleWorker } from '../../../base/common/worker/simpleWorkerBootstrap.js';

bootstrapSimpleWorker(create);
