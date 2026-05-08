# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: test\leaks\server.js
# Merge Date: 2026-05-07T19:25:07.699466
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');

const app = new Koa();

app.use(serve('.'));
app.use(mount('/static', serve('../../out')));

app.listen(3000);
console.log('👉 http://localhost:3000');
