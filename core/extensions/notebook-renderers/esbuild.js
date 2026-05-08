# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\notebook-renderers\esbuild.js
# Merge Date: 2026-05-07T19:22:19.160823
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'renderer-out');

require('../esbuild-webview-common').run({
	entryPoints: [
		path.join(srcDir, 'index.ts'),
	],
	srcDir,
	outdir: outDir,
}, process.argv);
