# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\userDataProfile\common\userDataProfile.ts
# Merge Date: 2026-05-07T19:24:45.334463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { IUserDataProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IEditorPane } from '../../../common/editor.js';

export interface IUserDataProfilesEditor extends IEditorPane {
	createNewProfile(copyFrom?: URI | IUserDataProfile): Promise<void>;
	selectProfile(profile: IUserDataProfile): void;
}
