# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.tokenInformation.d.ts
# Merge Date: 2026-05-07T19:25:06.394465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/91555

	export enum StandardTokenType {
		Other = 0,
		Comment = 1,
		String = 2,
		RegEx = 3
	}

	export interface TokenInformation {
		type: StandardTokenType;
		range: Range;
	}

	export namespace languages {
		/** @deprecated */
		export function getTokenInformationAtPosition(document: TextDocument, position: Position): Thenable<TokenInformation>;
	}
}
