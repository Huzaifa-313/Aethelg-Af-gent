# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\common\functional.ts
# Merge Date: 2026-05-07T19:22:43.984375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Given a function, returns a function that is only calling that function once.
 */
export function createSingleCallFunction<T extends Function>(this: unknown, fn: T, fnDidRunCallback?: () => void): T {
	const _this = this;
	let didCall = false;
	let result: unknown;

	return function () {
		if (didCall) {
			return result;
		}

		didCall = true;
		if (fnDidRunCallback) {
			try {
				result = fn.apply(_this, arguments);
			} finally {
				fnDidRunCallback();
			}
		} else {
			result = fn.apply(_this, arguments);
		}

		return result;
	} as unknown as T;
}
