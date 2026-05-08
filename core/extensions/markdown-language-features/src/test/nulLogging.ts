# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\test\nulLogging.ts
# Merge Date: 2026-05-07T19:22:15.158309
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogger } from '../logging';

export const nulLogger = new class implements ILogger {
	verbose(): void {
		// noop
	}
};
