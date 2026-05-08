# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\utils\packageInfo.ts
# Merge Date: 2026-05-07T19:22:29.687374
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export interface PackageInfo {
	name: string;
	version: string;
	aiKey: string;
}

export function getPackageInfo(context: vscode.ExtensionContext) {
	const packageJSON = context.extension.packageJSON;
	if (packageJSON && typeof packageJSON === 'object') {
		return {
			name: packageJSON.name ?? '',
			version: packageJSON.version ?? '',
			aiKey: packageJSON.aiKey ?? '',
		};
	}
	return null;
}
