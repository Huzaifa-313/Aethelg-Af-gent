# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\browser\notebookLogger.ts
# Merge Date: 2026-05-07T19:24:15.098945
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// import * as DOM from 'vs/base/browser/dom';

class NotebookLogger {
	constructor() {
		this._domFrameLog();
	}
	private _frameId = 0;
	private _domFrameLog() {
		// DOM.scheduleAtNextAnimationFrame(() => {
		// 	this._frameId++;

		// 	this._domFrameLog();
		// }, 1000000);
	}

	debug(...args: any[]) {
		const date = new Date();
		console.log(`${date.getSeconds()}:${date.getMilliseconds().toString().padStart(3, '0')}`, `frame #${this._frameId}: `, ...args);
	}
}

const instance = new NotebookLogger();
export function notebookDebug(...args: any[]) {
	instance.debug(...args);
}

