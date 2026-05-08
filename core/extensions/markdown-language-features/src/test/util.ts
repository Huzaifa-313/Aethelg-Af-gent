# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\test\util.ts
# Merge Date: 2026-05-07T19:22:15.228305
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as os from 'os';

export const joinLines = (...args: string[]) =>
	args.join(os.platform() === 'win32' ? '\r\n' : '\n');
