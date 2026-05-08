# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.documentFiltersExclusive.d.ts
# Merge Date: 2026-05-07T19:25:05.093464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// todo@jrieken add issue reference

	export interface DocumentFilter {
		readonly exclusive?: boolean;
	}
}
