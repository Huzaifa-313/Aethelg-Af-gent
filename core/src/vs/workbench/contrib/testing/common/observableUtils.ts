# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\testing\common\observableUtils.ts
# Merge Date: 2026-05-07T19:24:43.488463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable, IObserver } from '../../../../base/common/observable.js';

export function onObservableChange<T>(observable: IObservable<unknown, T>, callback: (value: T) => void): IDisposable {
	const o: IObserver = {
		beginUpdate() { },
		endUpdate() { },
		handlePossibleChange(observable) {
			observable.reportChanges();
		},
		handleChange<T2, TChange>(_observable: IObservable<T2, TChange>, change: TChange) {
			callback(change as any as T);
		}
	};

	observable.addObserver(o);
	return {
		dispose() {
			observable.removeObserver(o);
		}
	};
}
