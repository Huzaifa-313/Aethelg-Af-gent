# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\common\model\textModelPart.ts
# Merge Date: 2026-05-07T19:23:00.802374
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';

export class TextModelPart extends Disposable {
	private _isDisposed = false;

	public override dispose(): void {
		super.dispose();
		this._isDisposed = true;
	}
	protected assertNotDisposed(): void {
		if (this._isDisposed) {
			throw new Error('TextModelPart is disposed!');
		}
	}
}
