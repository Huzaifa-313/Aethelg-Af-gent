# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.chatReferenceBinaryData.d.ts
# Merge Date: 2026-05-07T19:25:04.471465
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	export interface ChatPromptReference {
		/**
		 * The value of this reference. The `string | Uri | Location` types are used today, but this could expand in the future.
		 */
		readonly value: string | Uri | Location | ChatReferenceBinaryData | unknown;
	}

	export class ChatReferenceBinaryData {
		/**
		 * The MIME type of the binary data.
		 */
		readonly mimeType: string;

		/**
		 * Retrieves the binary data of the reference.
		 * @returns A promise that resolves to the binary data as a Uint8Array.
		 */
		data(): Thenable<Uint8Array>;

		/**
		 * @param mimeType The MIME type of the binary data.
		 * @param data The binary data of the reference.
		 */
		constructor(mimeType: string, data: () => Thenable<Uint8Array>);
	}
}
