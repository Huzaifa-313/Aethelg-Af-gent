# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\speech\test\common\speechService.test.ts
# Merge Date: 2026-05-07T19:24:33.092463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { speechLanguageConfigToLanguage } from '../../common/speechService.js';

suite('SpeechService', () => {

	test('resolve language', async () => {
		assert.strictEqual(speechLanguageConfigToLanguage(undefined), 'en-US');
		assert.strictEqual(speechLanguageConfigToLanguage(3), 'en-US');
		assert.strictEqual(speechLanguageConfigToLanguage('foo'), 'en-US');
		assert.strictEqual(speechLanguageConfigToLanguage('foo-bar'), 'en-US');

		assert.strictEqual(speechLanguageConfigToLanguage('tr-TR'), 'tr-TR');
		assert.strictEqual(speechLanguageConfigToLanguage('zh-TW'), 'zh-TW');

		assert.strictEqual(speechLanguageConfigToLanguage('auto', 'en'), 'en-US');
		assert.strictEqual(speechLanguageConfigToLanguage('auto', 'tr'), 'tr-TR');
		assert.strictEqual(speechLanguageConfigToLanguage('auto', 'zh-tw'), 'zh-TW');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
