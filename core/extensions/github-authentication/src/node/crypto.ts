# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\github-authentication\src\node\crypto.ts
# Merge Date: 2026-05-07T19:22:06.952306
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { webcrypto } from 'crypto';

export const crypto = webcrypto as any as Crypto;
