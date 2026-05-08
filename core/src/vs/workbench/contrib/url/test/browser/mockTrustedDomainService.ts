# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\url\test\browser\mockTrustedDomainService.ts
# Merge Date: 2026-05-07T19:24:45.098474
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../base/common/uri.js';
import { isURLDomainTrusted, ITrustedDomainService } from '../../browser/trustedDomainService.js';

export class MockTrustedDomainService implements ITrustedDomainService {
	_serviceBrand: undefined;

	constructor(private readonly _trustedDomains: string[] = []) {
	}

	isValid(resource: URI): boolean {
		return isURLDomainTrusted(resource, this._trustedDomains);
	}
}
