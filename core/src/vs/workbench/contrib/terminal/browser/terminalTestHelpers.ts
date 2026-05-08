# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminal\browser\terminalTestHelpers.ts
# Merge Date: 2026-05-07T19:24:35.642463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../base/common/async.js';
import type { Terminal } from '@xterm/xterm';

export async function writeP(terminal: Terminal, data: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const failTimeout = timeout(2000);
		failTimeout.then(() => reject('Writing to xterm is taking longer than 2 seconds'));
		terminal.write(data, () => {
			failTimeout.cancel();
			resolve();
		});
	});
}
