# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\microsoft-authentication\src\node\buffer.ts
# Merge Date: 2026-05-07T19:22:18.675823
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function base64Encode(text: string): string {
	return Buffer.from(text, 'binary').toString('base64');
}

export function base64Decode(text: string): string {
	return Buffer.from(text, 'base64').toString('utf8');
}
