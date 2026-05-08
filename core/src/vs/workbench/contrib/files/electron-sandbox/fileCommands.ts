# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\files\electron-sandbox\fileCommands.ts
# Merge Date: 2026-05-07T19:24:10.423946
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { sequence } from '../../../../base/common/async.js';
import { Schemas } from '../../../../base/common/network.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';

// Commands

export function revealResourcesInOS(resources: URI[], nativeHostService: INativeHostService, workspaceContextService: IWorkspaceContextService): void {
	if (resources.length) {
		sequence(resources.map(r => async () => {
			if (r.scheme === Schemas.file || r.scheme === Schemas.vscodeUserData) {
				nativeHostService.showItemInFolder(r.with({ scheme: Schemas.file }).fsPath);
			}
		}));
	} else if (workspaceContextService.getWorkspace().folders.length) {
		const uri = workspaceContextService.getWorkspace().folders[0].uri;
		if (uri.scheme === Schemas.file) {
			nativeHostService.showItemInFolder(uri.fsPath);
		}
	}
}
