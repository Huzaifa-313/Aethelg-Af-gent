# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\languageDetection\browser\languageDetectionSimpleWorkerMain.ts
# Merge Date: 2026-05-07T19:24:54.569467
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { create } from './languageDetectionSimpleWorker.js';
import { bootstrapSimpleWorker } from '../../../../base/common/worker/simpleWorkerBootstrap.js';

bootstrapSimpleWorker(create);
