# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\speech\browser\speech.contribution.ts
# Merge Date: 2026-05-07T19:24:33.001463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ISpeechService } from '../common/speechService.js';
import { SpeechService } from './speechService.js';

registerSingleton(ISpeechService, SpeechService, InstantiationType.Eager /* Reads Extension Points */);
