# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\git-base\src\remoteProvider.ts
# Merge Date: 2026-05-07T19:22:05.445307
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, Event } from 'vscode';
import { RemoteSourceProvider } from './api/git-base';

export interface IRemoteSourceProviderRegistry {
	readonly onDidAddRemoteSourceProvider: Event<RemoteSourceProvider>;
	readonly onDidRemoveRemoteSourceProvider: Event<RemoteSourceProvider>;

	getRemoteProviders(): RemoteSourceProvider[];
	registerRemoteSourceProvider(provider: RemoteSourceProvider): Disposable;
}
