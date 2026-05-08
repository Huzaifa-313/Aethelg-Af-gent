# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\api\browser\mainThreadErrors.ts
# Merge Date: 2026-05-07T19:23:42.725944
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SerializedError, onUnexpectedError, transformErrorFromSerialization } from '../../../base/common/errors.js';
import { extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { MainContext, MainThreadErrorsShape } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadErrors)
export class MainThreadErrors implements MainThreadErrorsShape {

	dispose(): void {
		//
	}

	$onUnexpectedError(err: any | SerializedError): void {
		if (err && err.$isError) {
			err = transformErrorFromSerialization(err);
		}
		onUnexpectedError(err);
	}
}
