# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: .eslint-plugin-local\vscode-dts-cancellation.ts
# Merge Date: 2026-05-07T19:21:56.369306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

export = new class ApiProviderNaming implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		messages: {
			noToken: 'Function lacks a cancellation token, preferable as last argument',
		},
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {

		return {
			['TSInterfaceDeclaration[id.name=/.+Provider/] TSMethodSignature[key.name=/^(provide|resolve).+/]']: (node: any) => {

				let found = false;
				for (const param of (<TSESTree.TSMethodSignature>node).params) {
					if (param.type === AST_NODE_TYPES.Identifier) {
						found = found || param.name === 'token';
					}
				}

				if (!found) {
					context.report({
						node,
						messageId: 'noToken'
					});
				}
			}
		};
	}
};
