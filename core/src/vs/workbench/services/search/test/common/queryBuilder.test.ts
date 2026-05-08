# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\search\test\common\queryBuilder.test.ts
# Merge Date: 2026-05-07T19:24:56.695462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { isWindows } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { testWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { resolveResourcesForSearchIncludes } from '../../common/queryBuilder.js';
import { TestContextService } from '../../../../test/common/workbenchTestServices.js';

suite('QueryBuilderCommon', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	let context: IWorkspaceContextService;

	setup(() => {
		const workspace = testWorkspace(URI.file(isWindows ? 'C:\\testWorkspace' : '/testWorkspace'));
		context = new TestContextService(workspace);
	});

	test('resolveResourcesForSearchIncludes passes through paths without special glob characters', () => {
		const actual = resolveResourcesForSearchIncludes([URI.file(isWindows ? "C:\\testWorkspace\\pages\\blog" : "/testWorkspace/pages/blog")], context);
		assert.deepStrictEqual(actual, ["./pages/blog"]);
	});

	test('resolveResourcesForSearchIncludes escapes paths with special characters', () => {
		const actual = resolveResourcesForSearchIncludes([URI.file(isWindows ? "C:\\testWorkspace\\pages\\blog\\[postId]" : "/testWorkspace/pages/blog/[postId]")], context);
		assert.deepStrictEqual(actual, ["./pages/blog/[[]postId[]]"]);
	});
});
