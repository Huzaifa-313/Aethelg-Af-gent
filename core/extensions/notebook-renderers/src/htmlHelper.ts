# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\notebook-renderers\src\htmlHelper.ts
# Merge Date: 2026-05-07T19:22:19.514858
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const ttPolicy = (typeof window !== 'undefined') ?
	window.trustedTypes?.createPolicy('notebookRenderer', {
		createHTML: value => value,
		createScript: value => value,
	}) : undefined;
