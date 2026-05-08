# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\extension-browser.webpack.config.js
# Merge Date: 2026-05-07T19:22:13.334309
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

'use strict';

const CopyPlugin = require('copy-webpack-plugin');
const { browserPlugins, browser } = require('../shared.webpack.config');

module.exports = browser({
	context: __dirname,
	entry: {
		extension: './src/extension.browser.ts'
	},
	plugins: [
		...browserPlugins(__dirname), // add plugins, don't replace inherited
		new CopyPlugin({
			patterns: [
				{
					from: './node_modules/vscode-markdown-languageserver/dist/browser/workerMain.js',
					to: 'serverWorkerMain.js',
				}
			],
		}),
	],
}, {
	configFile: 'tsconfig.browser.json'
});
