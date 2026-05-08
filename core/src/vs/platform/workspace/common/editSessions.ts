# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\workspace\common\editSessions.ts
# Merge Date: 2026-05-07T19:23:40.994947
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IWorkspaceFolder } from './workspace.js';

export interface IEditSessionIdentityProvider {
	readonly scheme: string;
	getEditSessionIdentifier(workspaceFolder: IWorkspaceFolder, token: CancellationToken): Promise<string | undefined>;
	provideEditSessionIdentityMatch(workspaceFolder: IWorkspaceFolder, identity1: string, identity2: string, token: CancellationToken): Promise<EditSessionIdentityMatch | undefined>;
}

export const IEditSessionIdentityService = createDecorator<IEditSessionIdentityService>('editSessionIdentityService');

export interface IEditSessionIdentityService {
	readonly _serviceBrand: undefined;

	registerEditSessionIdentityProvider(provider: IEditSessionIdentityProvider): IDisposable;
	getEditSessionIdentifier(workspaceFolder: IWorkspaceFolder, cancellationToken: CancellationToken): Promise<string | undefined>;
	provideEditSessionIdentityMatch(workspaceFolder: IWorkspaceFolder, identity1: string, identity2: string, cancellationToken: CancellationToken): Promise<EditSessionIdentityMatch | undefined>;
	addEditSessionIdentityCreateParticipant(participants: IEditSessionIdentityCreateParticipant): IDisposable;
	onWillCreateEditSessionIdentity(workspaceFolder: IWorkspaceFolder, cancellationToken: CancellationToken): Promise<void>;
}

export interface IEditSessionIdentityCreateParticipant {
	participate(workspaceFolder: IWorkspaceFolder, cancellationToken: CancellationToken): Promise<void>;
}

export enum EditSessionIdentityMatch {
	Complete = 100,
	Partial = 50,
	None = 0,
}
