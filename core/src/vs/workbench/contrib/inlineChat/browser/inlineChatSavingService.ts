# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\inlineChat\browser\inlineChatSavingService.ts
# Merge Date: 2026-05-07T19:24:11.081947
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Session } from './inlineChatSession.js';


export const IInlineChatSavingService = createDecorator<IInlineChatSavingService>('IInlineChatSavingService	');

export interface IInlineChatSavingService {
	_serviceBrand: undefined;

	markChanged(session: Session): void;

}
