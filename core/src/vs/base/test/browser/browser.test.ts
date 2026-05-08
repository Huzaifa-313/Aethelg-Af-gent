# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\test\browser\browser.test.ts
# Merge Date: 2026-05-07T19:22:48.991376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { isMacintosh, isWindows } from '../../common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../common/utils.js';

suite('Browsers', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('all', () => {
		assert(!(isWindows && isMacintosh));
	});
});
