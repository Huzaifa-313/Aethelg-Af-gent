# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\common\comments.ts
# Merge Date: 2026-05-07T19:23:54.841947
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarshalledId } from '../../base/common/marshallingIds.js';
import { CommentThread } from '../../editor/common/languages.js';

export interface MarshalledCommentThread {
	$mid: MarshalledId.CommentThread;
	commentControlHandle: number;
	commentThreadHandle: number;
}

export interface MarshalledCommentThreadInternal extends MarshalledCommentThread {
	thread: CommentThread;
}
