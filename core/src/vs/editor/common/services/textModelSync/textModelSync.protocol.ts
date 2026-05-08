# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\common\services\textModelSync\textModelSync.protocol.ts
# Merge Date: 2026-05-07T19:23:02.247382
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IModelChangedEvent } from '../../model/mirrorTextModel.js';

export interface IWorkerTextModelSyncChannelServer {
	$acceptNewModel(data: IRawModelData): void;

	$acceptModelChanged(strURL: string, e: IModelChangedEvent): void;

	$acceptRemovedModel(strURL: string): void;
}

export interface IRawModelData {
	url: string;
	versionId: number;
	lines: string[];
	EOL: string;
}
