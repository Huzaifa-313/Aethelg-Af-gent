# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\browser\ui\progressbar\progressAccessibilitySignal.ts
# Merge Date: 2026-05-07T19:22:41.891376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../common/lifecycle.js';

export interface IScopedAccessibilityProgressSignalDelegate extends IDisposable { }

const nullScopedAccessibilityProgressSignalFactory = () => ({
	msLoopTime: -1,
	msDelayTime: -1,
	dispose: () => { },
});
let progressAccessibilitySignalSchedulerFactory: (msDelayTime: number, msLoopTime?: number) => IScopedAccessibilityProgressSignalDelegate = nullScopedAccessibilityProgressSignalFactory;

export function setProgressAcccessibilitySignalScheduler(progressAccessibilitySignalScheduler: (msDelayTime: number, msLoopTime?: number) => IScopedAccessibilityProgressSignalDelegate) {
	progressAccessibilitySignalSchedulerFactory = progressAccessibilitySignalScheduler;
}

export function getProgressAcccessibilitySignalScheduler(msDelayTime: number, msLoopTime?: number): IScopedAccessibilityProgressSignalDelegate {
	return progressAccessibilitySignalSchedulerFactory(msDelayTime, msLoopTime);
}
