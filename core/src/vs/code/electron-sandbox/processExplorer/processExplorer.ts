# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\code\electron-sandbox\processExplorer\processExplorer.ts
# Merge Date: 2026-05-07T19:22:52.963376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable no-restricted-globals */

(async function () {

	type IBootstrapWindow = import('vs/platform/window/electron-sandbox/window.js').IBootstrapWindow;
	type IProcessExplorerMain = import('vs/code/electron-sandbox/processExplorer/processExplorerMain.js').IProcessExplorerMain;
	type ProcessExplorerWindowConfiguration = import('vs/platform/process/common/process.js').ProcessExplorerWindowConfiguration;

	const bootstrapWindow: IBootstrapWindow = (window as any).MonacoBootstrapWindow; // defined by bootstrap-window.ts

	const { result, configuration } = await bootstrapWindow.load<IProcessExplorerMain, ProcessExplorerWindowConfiguration>('vs/code/electron-sandbox/processExplorer/processExplorerMain', {
		configureDeveloperSettings: function () {
			return {
				forceEnableDeveloperKeybindings: true
			};
		},
	});

	result.startup(configuration);
}());
