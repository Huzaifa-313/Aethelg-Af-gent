# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\extensions\browser\extensions.web.contribution.ts
# Merge Date: 2026-05-07T19:24:07.934946
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { RuntimeExtensionsEditor } from './browserRuntimeExtensionsEditor.js';
import { RuntimeExtensionsInput } from '../common/runtimeExtensionsInput.js';
import { EditorExtensions } from '../../../common/editor.js';

// Running Extensions
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(RuntimeExtensionsEditor, RuntimeExtensionsEditor.ID, localize('runtimeExtension', "Running Extensions")),
	[new SyncDescriptor(RuntimeExtensionsInput)]
);
