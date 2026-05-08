# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\backup\electron-main\backup.ts
# Merge Date: 2026-05-07T19:23:26.554946
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEmptyWindowBackupInfo } from '../node/backup.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IFolderBackupInfo, IWorkspaceBackupInfo } from '../common/backup.js';

export const IBackupMainService = createDecorator<IBackupMainService>('backupMainService');

export interface IBackupMainService {

	readonly _serviceBrand: undefined;

	isHotExitEnabled(): boolean;

	getEmptyWindowBackups(): IEmptyWindowBackupInfo[];

	registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo): string;
	registerWorkspaceBackup(workspaceInfo: IWorkspaceBackupInfo, migrateFrom: string): Promise<string>;
	registerFolderBackup(folderInfo: IFolderBackupInfo): string;
	registerEmptyWindowBackup(emptyWindowInfo: IEmptyWindowBackupInfo): string;

	/**
	 * All folders or workspaces that are known to have
	 * backups stored. This call is long running because
	 * it checks for each backup location if any backups
	 * are stored.
	 */
	getDirtyWorkspaces(): Promise<Array<IWorkspaceBackupInfo | IFolderBackupInfo>>;
}
