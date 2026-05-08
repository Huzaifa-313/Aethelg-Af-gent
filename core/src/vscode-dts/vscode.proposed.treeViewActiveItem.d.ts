# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.treeViewActiveItem.d.ts
# Merge Date: 2026-05-07T19:25:06.413463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/170248

	export interface TreeView<T> extends Disposable {
		/**
		 * Currently active item.
		 */
		readonly activeItem: T | undefined;
		/**
		 * Event that is fired when the {@link TreeView.activeItem active item} has changed
		 */
		readonly onDidChangeActiveItem: Event<TreeViewActiveItemChangeEvent<T>>;
	}

	/**
	 * The event that is fired when there is a change in {@link TreeView.activeItem tree view's active item}
	 */
	export interface TreeViewActiveItemChangeEvent<T> {
		/**
		 * Active item.
		 */
		readonly activeItem: T | undefined;
	}
}
