# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\editor\contrib\hover\browser\hoverUtils.ts
# Merge Date: 2026-05-07T19:23:07.107376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';

export function isMousePositionWithinElement(element: HTMLElement, posx: number, posy: number): boolean {
	const elementRect = dom.getDomNodePagePosition(element);
	if (posx < elementRect.left
		|| posx > elementRect.left + elementRect.width
		|| posy < elementRect.top
		|| posy > elementRect.top + elementRect.height) {
		return false;
	}
	return true;
}
