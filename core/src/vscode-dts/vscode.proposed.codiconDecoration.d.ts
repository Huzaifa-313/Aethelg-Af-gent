# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vscode-dts\vscode.proposed.codiconDecoration.d.ts
# Merge Date: 2026-05-07T19:25:04.543464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

	// https://github.com/microsoft/vscode/issues/135591 @alexr00

	// export interface FileDecorationProvider {
	// 	provideFileDecoration(uri: Uri, token: CancellationToken): ProviderResult<FileDecoration | FileDecoration1>;
	// }

	/**
	 * A file decoration represents metadata that can be rendered with a file.
	 */
	export class FileDecoration2 {
		/**
		 * A very short string that represents this decoration.
		 */
		badge?: string | ThemeIcon;

		/**
		 * A human-readable tooltip for this decoration.
		 */
		tooltip?: string;

		/**
		 * The color of this decoration.
		 */
		color?: ThemeColor;

		/**
		 * A flag expressing that this decoration should be
		 * propagated to its parents.
		 */
		propagate?: boolean;

		/**
		 * Creates a new decoration.
		 *
		 * @param badge A letter that represents the decoration.
		 * @param tooltip The tooltip of the decoration.
		 * @param color The color of the decoration.
		 */
		constructor(badge?: string | ThemeIcon, tooltip?: string, color?: ThemeColor);
	}
}
