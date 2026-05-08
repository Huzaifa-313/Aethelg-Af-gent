# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\test\common\utils.ts
# Merge Date: 2026-05-07T19:25:04.026465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { LanguagesRegistry } from '../../../editor/common/services/languagesRegistry.js';

/**
 * This function is called before test running and also again at the end of test running
 * and can be used to add assertions. e.g. that registries are empty, etc.
 *
 * !! This is called directly by the testing framework.
 *
 * @skipMangle
 */
export function assertCleanState(): void {
	// If this test fails, it is a clear indication that
	// your test or suite is leaking services (e.g. via leaking text models)
	// assert.strictEqual(LanguageService.instanceCount, 0, 'No leaking ILanguageService');
	assert.strictEqual(LanguagesRegistry.instanceCount, 0, 'Error: Test run should not leak in LanguagesRegistry.');
}
