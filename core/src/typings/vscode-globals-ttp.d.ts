# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\typings\vscode-globals-ttp.d.ts
# Merge Date: 2026-05-07T19:22:39.251375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// AMD2ESM migration relevant

declare global {

	var _VSCODE_WEB_PACKAGE_TTP: Pick<TrustedTypePolicy<{
		createScriptURL(value: string): string;
	}>, 'name' | 'createScriptURL'> | undefined;
}

// fake export to make global work
export { }
