# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\npm\extension-browser.webpack.config.js
# Merge Date: 2026-05-07T19:22:19.894858
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

'use strict';

const withBrowserDefaults = require('../shared.webpack.config').browser;

const config = withBrowserDefaults({
	context: __dirname,
	entry: {
		extension: './src/npmBrowserMain.ts'
	},
	output: {
		filename: 'npmBrowserMain.js'
	},
	resolve: {
		fallback: {
			'child_process': false
		}
	}
});

module.exports = config;
