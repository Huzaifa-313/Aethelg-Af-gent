# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: .eslint-plugin-local\vscode-dts-string-type-literals.ts
# Merge Date: 2026-05-07T19:21:56.492306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { TSESTree } from '@typescript-eslint/utils';

export = new class ApiTypeDiscrimination implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		docs: { url: 'https://github.com/microsoft/vscode/wiki/Extension-API-guidelines' },
		messages: {
			noTypeDiscrimination: 'Do not use type discrimination properties'
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			['TSPropertySignature[optional=false] TSTypeAnnotation TSLiteralType Literal']: (node: any) => {
				const raw = String((<TSESTree.Literal>node).raw)

				if (/^('|").*\1$/.test(raw)) {

					context.report({
						node: node,
						messageId: 'noTypeDiscrimination'
					});
				}
			}
		}
	}
};
