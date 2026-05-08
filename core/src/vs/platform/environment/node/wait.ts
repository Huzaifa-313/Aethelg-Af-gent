# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\environment\node\wait.ts
# Merge Date: 2026-05-07T19:23:28.421949
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { randomPath } from '../../../base/common/extpath.js';

export function createWaitMarkerFileSync(verbose?: boolean): string | undefined {
	const randomWaitMarkerPath = randomPath(tmpdir());

	try {
		writeFileSync(randomWaitMarkerPath, ''); // use built-in fs to avoid dragging in more dependencies
		if (verbose) {
			console.log(`Marker file for --wait created: ${randomWaitMarkerPath}`);
		}
		return randomWaitMarkerPath;
	} catch (err) {
		if (verbose) {
			console.error(`Failed to create marker file for --wait: ${err}`);
		}
		return undefined;
	}
}
