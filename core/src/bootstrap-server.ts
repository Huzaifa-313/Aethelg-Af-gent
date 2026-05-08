# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\bootstrap-server.ts
# Merge Date: 2026-05-07T19:22:38.893377
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Keep bootstrap-esm.js from redefining 'fs'.
delete process.env['ELECTRON_RUN_AS_NODE'];
