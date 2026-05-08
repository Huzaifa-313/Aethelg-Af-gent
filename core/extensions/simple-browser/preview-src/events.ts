# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\simple-browser\preview-src\events.ts
# Merge Date: 2026-05-07T19:22:24.527379
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function onceDocumentLoaded(f: () => void) {
	if (document.readyState === 'loading' || document.readyState as string === 'uninitialized') {
		document.addEventListener('DOMContentLoaded', f);
	} else {
		f();
	}
}