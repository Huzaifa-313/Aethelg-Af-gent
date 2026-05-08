# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-math\extension.webpack.config.js
# Merge Date: 2026-05-07T19:22:15.709305
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

'use strict';

const withDefaults = require('../shared.webpack.config');

module.exports = withDefaults({
	context: __dirname,
	resolve: {
		mainFields: ['module', 'main']
	},
	entry: {
		extension: './src/extension.ts',
	}
});
