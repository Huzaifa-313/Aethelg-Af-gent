# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\testing\browser\explorerProjections\testingViewState.ts
# Merge Date: 2026-05-07T19:24:43.139464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TestId } from '../../common/testId.js';

export interface ISerializedTestTreeCollapseState {
	collapsed?: boolean;
	children?: { [localId: string]: ISerializedTestTreeCollapseState };
}

/**
 * Gets whether the given test ID is collapsed.
 */
export function isCollapsedInSerializedTestTree(serialized: ISerializedTestTreeCollapseState, id: TestId | string): boolean | undefined {
	if (!(id instanceof TestId)) {
		id = TestId.fromString(id);
	}

	let node = serialized;
	for (const part of id.path) {
		if (!node.children?.hasOwnProperty(part)) {
			return undefined;
		}

		node = node.children[part];
	}

	return node.collapsed;
}
