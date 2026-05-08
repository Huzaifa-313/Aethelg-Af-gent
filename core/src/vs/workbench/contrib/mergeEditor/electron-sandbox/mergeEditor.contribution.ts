# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\mergeEditor\electron-sandbox\mergeEditor.contribution.ts
# Merge Date: 2026-05-07T19:24:14.587944
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { MergeEditorOpenContentsFromJSON, OpenSelectionInTemporaryMergeEditor } from './devCommands.js';

// Dev Commands
registerAction2(MergeEditorOpenContentsFromJSON);
registerAction2(OpenSelectionInTemporaryMergeEditor);
