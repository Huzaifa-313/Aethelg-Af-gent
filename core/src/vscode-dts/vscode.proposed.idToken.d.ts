# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.idToken.d.ts
# Merge Date: 2026-05-07T19:25:05.386463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {
	/**
	 * Represents a session of a currently logged in user.
	 */
	export interface AuthenticationSession {
		/**
		 * An optional ID token that may be included in the session.
		 */
		readonly idToken?: string;
	}
}
