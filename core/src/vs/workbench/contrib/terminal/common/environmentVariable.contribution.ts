# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminal\common\environmentVariable.contribution.ts
# Merge Date: 2026-05-07T19:24:36.038463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EnvironmentVariableService } from './environmentVariableService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IEnvironmentVariableService } from './environmentVariable.js';

registerSingleton(IEnvironmentVariableService, EnvironmentVariableService, InstantiationType.Delayed);
