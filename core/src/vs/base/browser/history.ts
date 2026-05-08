# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\browser\history.ts
# Merge Date: 2026-05-07T19:22:39.940375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../common/event.js';

export interface IHistoryNavigationWidget {

	readonly element: HTMLElement;

	showPreviousValue(): void;

	showNextValue(): void;

	onDidFocus: Event<void>;

	onDidBlur: Event<void>;

}
