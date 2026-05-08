# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\typescript-language-features\src\tsServer\protocol\protocol.d.ts
# Merge Date: 2026-05-07T19:22:29.420379
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type ts from '../../../../node_modules/typescript/lib/typescript';
export = ts.server.protocol;


declare enum ServerType {
	Syntax = 'syntax',
	Semantic = 'semantic',
}

declare module '../../../../node_modules/typescript/lib/typescript' {
	namespace server.protocol {
		type TextInsertion = ts.TextInsertion;
		type ScriptElementKind = ts.ScriptElementKind;

		interface Response {
			readonly _serverType?: ServerType;
		}
	}
}
