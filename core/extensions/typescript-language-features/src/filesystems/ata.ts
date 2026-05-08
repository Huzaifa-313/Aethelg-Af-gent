# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\filesystems\ata.ts
# Merge Date: 2026-05-07T19:22:27.313374
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { conditionalRegistration, requireGlobalConfiguration } from '../languageFeatures/util/dependentRegistration';
import { supportsReadableByteStreams } from '../utils/platform';
import { AutoInstallerFs } from './autoInstallerFs';
import { MemFs } from './memFs';
import { Logger } from '../logging/logger';

export function registerAtaSupport(logger: Logger): vscode.Disposable {
	if (!supportsReadableByteStreams()) {
		return vscode.Disposable.from();
	}

	return conditionalRegistration([
		requireGlobalConfiguration('typescript', 'tsserver.web.typeAcquisition.enabled'),
	], () => {
		return vscode.Disposable.from(
			// Ata
			vscode.workspace.registerFileSystemProvider('vscode-global-typings', new MemFs('global-typings', logger), {
				isCaseSensitive: true,
				isReadonly: false,
			}),

			// Read accesses to node_modules
			vscode.workspace.registerFileSystemProvider('vscode-node-modules', new AutoInstallerFs(logger), {
				isCaseSensitive: true,
				isReadonly: false
			}));
	});
}
