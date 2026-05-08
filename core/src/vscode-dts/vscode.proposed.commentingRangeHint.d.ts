# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.commentingRangeHint.d.ts
# Merge Date: 2026-05-07T19:25:04.557463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// @alexr00 https://github.com/microsoft/vscode/issues/185551

	/**
	 * Commenting range provider for a {@link CommentController comment controller}.
	 */
	export interface CommentingRangeProvider {
		readonly resourceHints?: { schemes: readonly string[] };
	}
}
