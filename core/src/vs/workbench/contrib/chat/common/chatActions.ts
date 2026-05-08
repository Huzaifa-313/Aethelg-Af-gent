# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\chat\common\chatActions.ts
# Merge Date: 2026-05-07T19:23:59.918945
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MarshalledId } from '../../../../base/common/marshallingIds.js';

export interface IChatViewTitleActionContext {
	$mid: MarshalledId.ChatViewContext;
	sessionId: string;
}

export function isChatViewTitleActionContext(obj: unknown): obj is IChatViewTitleActionContext {
	return !!obj &&
		typeof (obj as IChatViewTitleActionContext).sessionId === 'string'
		&& (obj as IChatViewTitleActionContext).$mid === MarshalledId.ChatViewContext;
}
