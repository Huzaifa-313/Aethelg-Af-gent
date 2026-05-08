# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.authLearnMore.d.ts
# Merge Date: 2026-05-07T19:25:04.307465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/206587

	export interface AuthenticationForceNewSessionOptions {
		/**
		 * An optional Uri to open in the browser to learn more about this authentication request.
		 */
		learnMore?: Uri;
	}
}
