# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.chatEditing.d.ts
# Merge Date: 2026-05-07T19:25:04.368465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface ChatRequestDraft {
		readonly prompt: string;
		readonly files: readonly Uri[];
	}

	export interface ChatRelatedFile {
		readonly uri: Uri;
		readonly description: string;
	}

	export interface ChatRelatedFilesProviderMetadata {
		readonly description: string;
	}

	export interface ChatRelatedFilesProvider {
		provideRelatedFiles(chatRequest: ChatRequestDraft, token: CancellationToken): ProviderResult<ChatRelatedFile[]>;
	}

	export namespace chat {
		export function registerRelatedFilesProvider(provider: ChatRelatedFilesProvider, metadata: ChatRelatedFilesProviderMetadata): Disposable;
	}
}
