# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\extensions\common\polyfillNestedWorker.protocol.ts
# Merge Date: 2026-05-07T19:24:51.560483
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


export interface NewWorkerMessage {
	type: '_newWorker';
	id: string;
	port: any /* MessagePort */;
	url: string;
	options: any /* WorkerOptions */ | undefined;
}

export interface TerminateWorkerMessage {
	type: '_terminateWorker';
	id: string;
}
