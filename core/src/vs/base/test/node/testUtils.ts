# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\test\node\testUtils.ts
# Merge Date: 2026-05-07T19:22:52.159376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { randomPath } from '../../common/extpath.js';
import { join } from '../../common/path.js';
import * as testUtils from '../common/testUtils.js';

export function getRandomTestPath(tmpdir: string, ...segments: string[]): string {
	return randomPath(join(tmpdir, ...segments));
}

export import flakySuite = testUtils.flakySuite;
