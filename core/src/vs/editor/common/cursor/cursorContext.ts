# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\common\cursor\cursorContext.ts
# Merge Date: 2026-05-07T19:22:59.329376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextModel } from '../model.js';
import { ICoordinatesConverter } from '../viewModel.js';
import { CursorConfiguration, ICursorSimpleModel } from '../cursorCommon.js';

export class CursorContext {
	_cursorContextBrand: void = undefined;

	public readonly model: ITextModel;
	public readonly viewModel: ICursorSimpleModel;
	public readonly coordinatesConverter: ICoordinatesConverter;
	public readonly cursorConfig: CursorConfiguration;

	constructor(model: ITextModel, viewModel: ICursorSimpleModel, coordinatesConverter: ICoordinatesConverter, cursorConfig: CursorConfiguration) {
		this.model = model;
		this.viewModel = viewModel;
		this.coordinatesConverter = coordinatesConverter;
		this.cursorConfig = cursorConfig;
	}
}
