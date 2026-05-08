# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\chat\test\browser\mockChatWidget.ts
# Merge Date: 2026-05-07T19:24:00.793944
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
import { IChatWidget, IChatWidgetService } from '../../browser/chat.js';
import { ChatAgentLocation } from '../../common/chatAgents.js';

export class MockChatWidgetService implements IChatWidgetService {
	readonly onDidAddWidget: Event<IChatWidget> = Event.None;

	readonly _serviceBrand: undefined;

	/**
	 * Returns the most recently focused widget if any.
	 */
	readonly lastFocusedWidget: IChatWidget | undefined;

	getWidgetByInputUri(uri: URI): IChatWidget | undefined {
		return undefined;
	}

	getWidgetBySessionId(sessionId: string): IChatWidget | undefined {
		return undefined;
	}

	getWidgetsByLocations(location: ChatAgentLocation): ReadonlyArray<IChatWidget> {
		return [];
	}
}
