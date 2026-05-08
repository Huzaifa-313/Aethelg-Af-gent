# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\workspace\test\common\testWorkspace.ts
# Merge Date: 2026-05-07T19:23:41.086946
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isLinux, isWindows } from '../../../../base/common/platform.js';
import { URI } from '../../../../base/common/uri.js';
import { toWorkspaceFolder, Workspace as BaseWorkspace, WorkspaceFolder } from '../../common/workspace.js';

export class Workspace extends BaseWorkspace {
	constructor(
		id: string,
		folders: WorkspaceFolder[] = [],
		configuration: URI | null = null,
		ignorePathCasing: (key: URI) => boolean = () => !isLinux
	) {
		super(id, folders, false, configuration, ignorePathCasing);
	}
}

const wsUri = URI.file(isWindows ? 'C:\\testWorkspace' : '/testWorkspace');
export const TestWorkspace = testWorkspace(wsUri);

export function testWorkspace(resource: URI): Workspace {
	return new Workspace(resource.toString(), [toWorkspaceFolder(resource)]);
}
