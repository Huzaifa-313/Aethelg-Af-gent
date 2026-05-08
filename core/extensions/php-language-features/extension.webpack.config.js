# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\php-language-features\extension.webpack.config.js
# Merge Date: 2026-05-07T19:22:21.567858
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
	entry: {
		extension: './src/phpMain.ts',
	},
	output: {
		filename: 'phpMain.js'
	}
});
