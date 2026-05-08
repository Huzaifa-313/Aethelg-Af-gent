# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\github\src\typings\vscode.proposed.shareProvider.d.ts
# Merge Date: 2026-05-07T19:22:06.242305
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// https://github.com/microsoft/vscode/issues/176316

declare module 'vscode' {
	export interface TreeItem {
		shareableItem?: ShareableItem;
	}

	export interface ShareableItem {
		resourceUri: Uri;
		selection?: Range;
	}

	export interface ShareProvider {
		readonly id: string;
		readonly label: string;
		readonly priority: number;

		provideShare(item: ShareableItem, token: CancellationToken): ProviderResult<Uri>;
	}

	export namespace window {
		export function registerShareProvider(selector: DocumentSelector, provider: ShareProvider): Disposable;
	}
}
