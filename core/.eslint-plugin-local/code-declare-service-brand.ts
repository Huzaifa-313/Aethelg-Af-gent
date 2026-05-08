# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: .eslint-plugin-local\code-declare-service-brand.ts
# Merge Date: 2026-05-07T19:21:55.868304
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';

export = new class DeclareServiceBrand implements eslint.Rule.RuleModule {

	readonly meta: eslint.Rule.RuleMetaData = {
		fixable: 'code',
		schema: false,
	};

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			['PropertyDefinition[key.name="_serviceBrand"][value]']: (node: any) => {
				return context.report({
					node,
					message: `The '_serviceBrand'-property should not have a value`,
					fix: (fixer) => {
						return fixer.replaceText(node, 'declare _serviceBrand: undefined;')
					}
				});
			}
		};
	}
};
