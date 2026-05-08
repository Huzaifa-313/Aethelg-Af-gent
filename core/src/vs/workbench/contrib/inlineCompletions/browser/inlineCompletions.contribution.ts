# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\inlineCompletions\browser\inlineCompletions.contribution.ts
# Merge Date: 2026-05-07T19:24:11.627944
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { wrapInHotClass1 } from '../../../../platform/observable/common/wrapInHotClass.js';
import { InlineCompletionLanguageStatusBarContribution } from './inlineCompletionLanguageStatusBarContribution.js';

registerEditorContribution(InlineCompletionLanguageStatusBarContribution.Id, wrapInHotClass1(InlineCompletionLanguageStatusBarContribution.hot), EditorContributionInstantiation.Eventually);
