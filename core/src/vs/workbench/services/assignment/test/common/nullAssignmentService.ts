# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\assignment\test\common\nullAssignmentService.ts
# Merge Date: 2026-05-07T19:24:48.095463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchAssignmentService } from '../../common/assignmentService.js';

export class NullWorkbenchAssignmentService implements IWorkbenchAssignmentService {
	_serviceBrand: undefined;

	async getCurrentExperiments(): Promise<string[] | undefined> {
		return [];
	}

	async getTreatment<T extends string | number | boolean>(name: string): Promise<T | undefined> {
		return undefined;
	}
}
