# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: .eslint-plugin-local\code-no-test-only.ts
# Merge Date: 2026-05-07T19:21:56.201306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as eslint from 'eslint';

export = new class NoTestOnly implements eslint.Rule.RuleModule {

	create(context: eslint.Rule.RuleContext): eslint.Rule.RuleListener {
		return {
			['MemberExpression[object.name=/^(test|suite)$/][property.name="only"]']: (node: any) => {
				return context.report({
					node,
					message: 'only is a dev-time tool and CANNOT be pushed'
				});
			}
		};
	}
};
