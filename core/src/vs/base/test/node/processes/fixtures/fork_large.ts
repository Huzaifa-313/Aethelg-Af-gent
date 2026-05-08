# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\test\node\processes\fixtures\fork_large.ts
# Merge Date: 2026-05-07T19:22:52.549378
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as processes from '../../../../node/processes.js';

const sender = processes.createQueuedSender(<any>process);

process.on('message', msg => {
	sender.send(msg);
	sender.send(msg);
	sender.send(msg);
	sender.send('done');
});

sender.send('ready');