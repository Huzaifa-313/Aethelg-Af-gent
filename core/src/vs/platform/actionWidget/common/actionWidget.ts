# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\actionWidget\common\actionWidget.ts
# Merge Date: 2026-05-07T19:23:26.427945
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../base/common/lifecycle.js';

export interface ActionSet<T> extends IDisposable {
	readonly validActions: readonly T[];
	readonly allActions: readonly T[];
	readonly hasAutoFix: boolean;
	readonly hasAIFix: boolean;
	readonly allAIFixes: boolean;
}
