# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\textMate\browser\backgroundTokenization\worker\textMateTokenizationWorker.workerMain.ts
# Merge Date: 2026-05-07T19:24:58.945462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { create } from './textMateTokenizationWorker.worker.js';
import { bootstrapSimpleWorker } from '../../../../../../base/common/worker/simpleWorkerBootstrap.js';

bootstrapSimpleWorker(create);
