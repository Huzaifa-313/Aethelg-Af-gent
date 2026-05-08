# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\comments\common\commentsConfiguration.ts
# Merge Date: 2026-05-07T19:24:03.637947
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ICommentsConfiguration {
	openView: 'never' | 'file' | 'firstFile' | 'firstFileUnresolved';
	useRelativeTime: boolean;
	visible: boolean;
	maxHeight: boolean;
	collapseOnResolve: boolean;
}

export const COMMENTS_SECTION = 'comments';
