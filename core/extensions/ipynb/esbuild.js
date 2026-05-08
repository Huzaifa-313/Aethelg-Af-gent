# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\ipynb\esbuild.js
# Merge Date: 2026-05-07T19:22:10.270305
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
//@ts-check

const path = require('path');

const srcDir = path.join(__dirname, 'notebook-src');
const outDir = path.join(__dirname, 'notebook-out');

require('../esbuild-webview-common').run({
	entryPoints: [
		path.join(srcDir, 'cellAttachmentRenderer.ts'),
	],
	srcDir,
	outdir: outDir,
}, process.argv);
