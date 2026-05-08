# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\integrity\browser\integrityService.ts
# Merge Date: 2026-05-07T19:24:52.447462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIntegrityService, IntegrityTestResult } from '../common/integrity.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export class IntegrityService implements IIntegrityService {

	declare readonly _serviceBrand: undefined;

	async isPure(): Promise<IntegrityTestResult> {
		return { isPure: true, proof: [] };
	}
}

registerSingleton(IIntegrityService, IntegrityService, InstantiationType.Delayed);
