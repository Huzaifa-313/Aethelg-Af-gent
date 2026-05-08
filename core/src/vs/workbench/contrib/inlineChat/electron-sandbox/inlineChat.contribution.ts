# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\inlineChat\electron-sandbox\inlineChat.contribution.ts
# Merge Date: 2026-05-07T19:24:11.413944
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { HoldToSpeak } from './inlineChatActions.js';

// start and hold for voice

registerAction2(HoldToSpeak);
