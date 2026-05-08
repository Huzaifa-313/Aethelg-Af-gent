# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\css-language-features\server\extension-browser.webpack.config.js
# Merge Date: 2026-05-07T19:22:00.784306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

'use strict';

const withBrowserDefaults = require('../../shared.webpack.config').browser;
const path = require('path');

module.exports = withBrowserDefaults({
	context: __dirname,
	entry: {
		extension: './src/browser/cssServerWorkerMain.ts',
	},
	output: {
		filename: 'cssServerMain.js',
		path: path.join(__dirname, 'dist', 'browser'),
		libraryTarget: 'var',
		library: 'serverExportVar'
	}
});
