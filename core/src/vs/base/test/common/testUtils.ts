# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\test\common\testUtils.ts
# Merge Date: 2026-05-07T19:22:51.707375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function flakySuite(title: string, fn: () => void) /* Suite */ {
	return suite(title, function () {

		// Flaky suites need retries and timeout to complete
		// e.g. because they access browser features which can
		// be unreliable depending on the environment.
		this.retries(3);
		this.timeout(1000 * 20);

		// Invoke suite ensuring that `this` is
		// properly wired in.
		fn.call(this);
	});
}
