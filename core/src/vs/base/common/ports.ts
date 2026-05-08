# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\common\ports.ts
# Merge Date: 2026-05-07T19:22:45.437375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * @returns Returns a random port between 1025 and 65535.
 */
export function randomPort(): number {
	const min = 1025;
	const max = 65535;
	return min + Math.floor((max - min) * Math.random());
}
