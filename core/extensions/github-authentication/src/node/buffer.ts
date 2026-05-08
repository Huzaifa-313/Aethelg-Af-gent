# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\github-authentication\src\node\buffer.ts
# Merge Date: 2026-05-07T19:22:06.937305
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function base64Encode(text: string): string {
	return Buffer.from(text, 'binary').toString('base64');
}
