# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\platform\userDataProfile\node\userDataProfileStorageService.ts
# Merge Date: 2026-05-07T19:23:38.477947
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService } from '../../storage/common/storage.js';
import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesService } from '../common/userDataProfile.js';
import { IMainProcessService } from '../../ipc/common/mainProcessService.js';
import { RemoteUserDataProfileStorageService } from '../common/userDataProfileStorageService.js';

export class SharedProcessUserDataProfileStorageService extends RemoteUserDataProfileStorageService {

	constructor(
		@IMainProcessService mainProcessService: IMainProcessService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
	) {
		super(true, mainProcessService, userDataProfilesService, storageService, logService);
	}
}
