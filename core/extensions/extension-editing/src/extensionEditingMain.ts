# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\extension-editing\src\extensionEditingMain.ts
# Merge Date: 2026-05-07T19:22:03.299304
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { PackageDocument } from './packageDocumentHelper';
import { ExtensionLinter } from './extensionLinter';

export function activate(context: vscode.ExtensionContext) {

	//package.json suggestions
	context.subscriptions.push(registerPackageDocumentCompletions());

	//package.json code actions for lint warnings
	context.subscriptions.push(registerCodeActionsProvider());

	context.subscriptions.push(new ExtensionLinter());
}

function registerPackageDocumentCompletions(): vscode.Disposable {
	return vscode.languages.registerCompletionItemProvider({ language: 'json', pattern: '**/package.json' }, {
		provideCompletionItems(document, position, token) {
			return new PackageDocument(document).provideCompletionItems(position, token);
		}
	});
}

function registerCodeActionsProvider(): vscode.Disposable {
	return vscode.languages.registerCodeActionsProvider({ language: 'json', pattern: '**/package.json' }, {
		provideCodeActions(document, range, context, token) {
			return new PackageDocument(document).provideCodeActions(range, context, token);
		}
	});
}
