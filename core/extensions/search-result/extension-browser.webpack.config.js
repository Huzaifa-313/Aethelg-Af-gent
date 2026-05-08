# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\search-result\extension-browser.webpack.config.js
# Merge Date: 2026-05-07T19:22:24.040377
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

'use strict';

const withBrowserDefaults = require('../shared.webpack.config').browser;
const path = require('path');

module.exports = withBrowserDefaults({
	context: __dirname,
	entry: {
		extension: './src/extension.ts'
	},
	output: {
		filename: 'extension.js',
		path: path.join(__dirname, 'dist')
	}
});
