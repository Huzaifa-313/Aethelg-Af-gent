# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\comments\browser\comments.ts
# Merge Date: 2026-05-07T19:24:02.916945
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IView } from '../../../common/views.js';
import { CommentsFilters } from './commentsViewActions.js';

export const CommentsViewFilterFocusContextKey = new RawContextKey<boolean>('commentsFilterFocus', false);

export interface ICommentsView extends IView {

	readonly filters: CommentsFilters;
	focusFilter(): void;
	clearFilterText(): void;
	getFilterStats(): { total: number; filtered: number };

	collapseAll(): void;
}
