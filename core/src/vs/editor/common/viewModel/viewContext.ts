# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\common\viewModel\viewContext.ts
# Merge Date: 2026-05-07T19:23:02.850378
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEditorConfiguration } from '../config/editorConfiguration.js';
import { ViewEventHandler } from '../viewEventHandler.js';
import { IViewLayout, IViewModel } from '../viewModel.js';
import { IColorTheme } from '../../../platform/theme/common/themeService.js';
import { EditorTheme } from '../editorTheme.js';

export class ViewContext {

	public readonly configuration: IEditorConfiguration;
	public readonly viewModel: IViewModel;
	public readonly viewLayout: IViewLayout;
	public readonly theme: EditorTheme;

	constructor(
		configuration: IEditorConfiguration,
		theme: IColorTheme,
		model: IViewModel
	) {
		this.configuration = configuration;
		this.theme = new EditorTheme(theme);
		this.viewModel = model;
		this.viewLayout = model.viewLayout;
	}

	public addEventHandler(eventHandler: ViewEventHandler): void {
		this.viewModel.addViewEventHandler(eventHandler);
	}

	public removeEventHandler(eventHandler: ViewEventHandler): void {
		this.viewModel.removeViewEventHandler(eventHandler);
	}
}
