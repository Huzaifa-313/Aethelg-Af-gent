# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\configurationResolver\common\configurationResolverUtils.ts
# Merge Date: 2026-05-07T19:24:48.993463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as nls from '../../../../nls.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';

export function applyDeprecatedVariableMessage(schema: IJSONSchema) {
	schema.pattern = schema.pattern || '^(?!.*\\$\\{(env|config|command)\\.)';
	schema.patternErrorMessage = schema.patternErrorMessage ||
		nls.localize('deprecatedVariables', "'env.', 'config.' and 'command.' are deprecated, use 'env:', 'config:' and 'command:' instead.");
}