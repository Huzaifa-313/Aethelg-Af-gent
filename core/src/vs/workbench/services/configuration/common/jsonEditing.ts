# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\configuration\common\jsonEditing.ts
# Merge Date: 2026-05-07T19:24:48.663466
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { JSONPath } from '../../../../base/common/json.js';

export const IJSONEditingService = createDecorator<IJSONEditingService>('jsonEditingService');

export const enum JSONEditingErrorCode {

	/**
	 * Error when trying to write to a file that contains JSON errors.
	 */
	ERROR_INVALID_FILE
}

export class JSONEditingError extends Error {
	constructor(message: string, public code: JSONEditingErrorCode) {
		super(message);
	}
}

export interface IJSONValue {
	path: JSONPath;
	value: any;
}

export interface IJSONEditingService {

	readonly _serviceBrand: undefined;

	write(resource: URI, values: IJSONValue[], save: boolean): Promise<void>;
}
