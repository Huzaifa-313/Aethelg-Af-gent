# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\browser\view\cellParts\cellWidgets.ts
# Merge Date: 2026-05-07T19:24:18.767965
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IClickTarget {
	type: ClickTargetType;
	event: MouseEvent;
}

export const enum ClickTargetType {
	Container = 0,
	ContributedTextItem = 1,
	ContributedCommandItem = 2
}
