# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\localization\electron-sandbox\languagePackService.ts
# Merge Date: 2026-05-07T19:24:54.836472
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILanguagePackService } from '../../../../platform/languagePacks/common/languagePacks.js';
import { registerSharedProcessRemoteService } from '../../../../platform/ipc/electron-sandbox/services.js';

registerSharedProcessRemoteService(ILanguagePackService, 'languagePacks');
