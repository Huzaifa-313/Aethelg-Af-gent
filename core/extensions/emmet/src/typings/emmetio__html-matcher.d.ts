# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\emmet\src\typings\emmetio__html-matcher.d.ts
# Merge Date: 2026-05-07T19:22:03.122304
# ---

/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/

declare module '@emmetio/html-matcher' {
	import { BufferStream, HtmlNode } from 'EmmetNode';
	import { HtmlNode as HtmlFlatNode } from 'EmmetFlatNode';

	function parse(stream: BufferStream): HtmlNode;
	function parse(stream: string): HtmlFlatNode;

	export default parse;
}

