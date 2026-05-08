# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\microsoft-authentication\src\logger.ts
# Merge Date: 2026-05-07T19:22:17.979822
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

const Logger = vscode.window.createOutputChannel(vscode.l10n.t('Microsoft Authentication'), { log: true });
export default Logger;
