# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminal\browser\widgets\widgets.ts
# Merge Date: 2026-05-07T19:24:35.835463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';

export interface ITerminalWidget extends IDisposable {
	/**
	 * Only one widget of each ID can be displayed at once.
	 */
	id: string;
	attach(container: HTMLElement): void;
}
