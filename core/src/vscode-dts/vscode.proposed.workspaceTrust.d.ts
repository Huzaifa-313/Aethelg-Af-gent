# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.workspaceTrust.d.ts
# Merge Date: 2026-05-07T19:25:06.517463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/120173

	/**
	 * The object describing the properties of the workspace trust request
	 */
	export interface WorkspaceTrustRequestOptions {
		/**
		 * Custom message describing the user action that requires workspace
		 * trust. If omitted, a generic message will be displayed in the workspace
		 * trust request dialog.
		 */
		readonly message?: string;
	}

	export namespace workspace {
		/**
		 * Prompt the user to chose whether to trust the current workspace
		 * @param options Optional object describing the properties of the
		 * workspace trust request.
		 */
		export function requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Thenable<boolean | undefined>;
	}
}
