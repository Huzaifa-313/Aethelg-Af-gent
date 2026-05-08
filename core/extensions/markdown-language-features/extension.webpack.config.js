# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\extension.webpack.config.js
# Merge Date: 2026-05-07T19:22:13.361309
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check

'use strict';

const CopyPlugin = require('copy-webpack-plugin');
const withDefaults = require('../shared.webpack.config');

module.exports = withDefaults({
	context: __dirname,
	resolve: {
		mainFields: ['module', 'main']
	},
	entry: {
		extension: './src/extension.ts',
	},
	plugins: [
		...withDefaults.nodePlugins(__dirname), // add plugins, don't replace inherited
		new CopyPlugin({
			patterns: [
				{
					from: './node_modules/vscode-markdown-languageserver/dist/node/workerMain.js',
					to: 'serverWorkerMain.js',
				}
			],
		}),
	],
});
