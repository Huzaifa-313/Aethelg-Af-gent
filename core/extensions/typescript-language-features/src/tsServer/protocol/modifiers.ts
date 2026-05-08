# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\tsServer\protocol\modifiers.ts
# Merge Date: 2026-05-07T19:22:29.392376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function parseKindModifier(kindModifiers: string): Set<string> {
	return new Set(kindModifiers.split(/,|\s+/g));
}
