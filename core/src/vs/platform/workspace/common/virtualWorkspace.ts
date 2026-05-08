# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\workspace\common\virtualWorkspace.ts
# Merge Date: 2026-05-07T19:23:41.016948
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IWorkspace } from './workspace.js';

export function isVirtualResource(resource: URI) {
	return resource.scheme !== Schemas.file && resource.scheme !== Schemas.vscodeRemote;
}

export function getVirtualWorkspaceLocation(workspace: IWorkspace): { scheme: string; authority: string } | undefined {
	if (workspace.folders.length) {
		return workspace.folders.every(f => isVirtualResource(f.uri)) ? workspace.folders[0].uri : undefined;
	} else if (workspace.configuration && isVirtualResource(workspace.configuration)) {
		return workspace.configuration;
	}
	return undefined;
}

export function getVirtualWorkspaceScheme(workspace: IWorkspace): string | undefined {
	return getVirtualWorkspaceLocation(workspace)?.scheme;
}

export function getVirtualWorkspaceAuthority(workspace: IWorkspace): string | undefined {
	return getVirtualWorkspaceLocation(workspace)?.authority;
}

export function isVirtualWorkspace(workspace: IWorkspace): boolean {
	return getVirtualWorkspaceLocation(workspace) !== undefined;
}
