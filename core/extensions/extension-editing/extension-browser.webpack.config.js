# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\extension-editing\extension-browser.webpack.config.js
# Merge Date: 2026-05-07T19:22:03.188309
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

'use strict';

const withBrowserDefaults = require('../shared.webpack.config').browser;

module.exports = withBrowserDefaults({
	context: __dirname,
	entry: {
		extension: './src/extensionEditingBrowserMain.ts'
	},
	output: {
		filename: 'extensionEditingBrowserMain.js'
	}
});

