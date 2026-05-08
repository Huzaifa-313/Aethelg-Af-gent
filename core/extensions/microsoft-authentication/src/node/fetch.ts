# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\microsoft-authentication\src\node\fetch.ts
# Merge Date: 2026-05-07T19:22:18.793822
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

let _fetch: typeof fetch;
try {
	_fetch = require('electron').net.fetch;
} catch {
	_fetch = fetch;
}
export default _fetch;
