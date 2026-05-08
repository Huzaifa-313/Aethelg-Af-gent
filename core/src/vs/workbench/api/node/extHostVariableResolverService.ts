# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\api\node\extHostVariableResolverService.ts
# Merge Date: 2026-05-07T19:23:47.577950
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { homedir } from 'os';
import { ExtHostVariableResolverProviderService } from '../common/extHostVariableResolverService.js';

export class NodeExtHostVariableResolverProviderService extends ExtHostVariableResolverProviderService {
	protected override homeDir(): string | undefined {
		return homedir();
	}
}
