# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\browser\view\dynamicViewOverlay.ts
# Merge Date: 2026-05-07T19:22:55.176376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RenderingContext } from './renderingContext.js';
import { ViewEventHandler } from '../../common/viewEventHandler.js';

export abstract class DynamicViewOverlay extends ViewEventHandler {

	public abstract prepareRender(ctx: RenderingContext): void;

	public abstract render(startLineNumber: number, lineNumber: number): string;

}
