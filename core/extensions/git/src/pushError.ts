# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\git\src\pushError.ts
# Merge Date: 2026-05-07T19:22:04.671307
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from 'vscode';
import { PushErrorHandler } from './api/git';

export interface IPushErrorHandlerRegistry {
	registerPushErrorHandler(provider: PushErrorHandler): Disposable;
	getPushErrorHandlers(): PushErrorHandler[];
}
