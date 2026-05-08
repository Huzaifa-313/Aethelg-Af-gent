# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\types\lib.url.d.ts
# Merge Date: 2026-05-07T19:22:26.233376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Define Url global for both browser and node runtimes
//
// Copied from https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34960

declare const URL: typeof import('url').URL;
