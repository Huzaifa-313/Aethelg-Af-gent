# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\browser\domObservable.ts
# Merge Date: 2026-05-07T19:22:39.775375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createStyleSheet2 } from './domStylesheets.js';
import { DisposableStore, IDisposable } from '../common/lifecycle.js';
import { autorun, IObservable } from '../common/observable.js';

export function createStyleSheetFromObservable(css: IObservable<string>): IDisposable {
	const store = new DisposableStore();
	const w = store.add(createStyleSheet2());
	store.add(autorun(reader => {
		w.setStyle(css.read(reader));
	}));
	return store;
}
