# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\test\common\assert.test.ts
# Merge Date: 2026-05-07T19:22:49.974378
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ok } from '../../common/assert.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from './utils.js';

suite('Assert', () => {
	test('ok', () => {
		assert.throws(function () {
			ok(false);
		});

		assert.throws(function () {
			ok(null);
		});

		assert.throws(function () {
			ok();
		});

		assert.throws(function () {
			ok(null, 'Foo Bar');
		}, function (e: Error) {
			return e.message.indexOf('Foo Bar') >= 0;
		});

		ok(true);
		ok('foo');
		ok({});
		ok(5);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
