# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\title\electron-sandbox\titleService.ts
# Merge Date: 2026-05-07T19:25:00.185466
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { NativeTitleService } from '../../../electron-sandbox/parts/titlebar/titlebarPart.js';
import { ITitleService } from '../browser/titleService.js';

registerSingleton(ITitleService, NativeTitleService, InstantiationType.Eager);
