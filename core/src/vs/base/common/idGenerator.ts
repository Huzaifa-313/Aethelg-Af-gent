# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\common\idGenerator.ts
# Merge Date: 2026-05-07T19:22:44.274375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class IdGenerator {

	private _prefix: string;
	private _lastId: number;

	constructor(prefix: string) {
		this._prefix = prefix;
		this._lastId = 0;
	}

	public nextId(): string {
		return this._prefix + (++this._lastId);
	}
}

export const defaultGenerator = new IdGenerator('id#');