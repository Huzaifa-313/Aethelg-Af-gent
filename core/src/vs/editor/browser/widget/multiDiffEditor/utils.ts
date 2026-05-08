# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\browser\widget\multiDiffEditor\utils.ts
# Merge Date: 2026-05-07T19:22:57.609375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActionRunner, IAction } from '../../../../base/common/actions.js';

export class ActionRunnerWithContext extends ActionRunner {
	constructor(private readonly _getContext: () => unknown) {
		super();
	}

	protected override runAction(action: IAction, _context?: unknown): Promise<void> {
		const ctx = this._getContext();
		return super.runAction(action, ctx);
	}
}
