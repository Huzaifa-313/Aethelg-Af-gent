# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\markdown-language-features\src\slugify.ts
# Merge Date: 2026-05-07T19:22:14.172305
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Slug {
	public constructor(
		public readonly value: string
	) { }

	public equals(other: Slug): boolean {
		return this.value === other.value;
	}
}

export interface Slugifier {
	fromHeading(heading: string): Slug;
}

export const githubSlugifier: Slugifier = new class implements Slugifier {
	fromHeading(heading: string): Slug {
		const slugifiedHeading = encodeURI(
			heading.trim()
				.toLowerCase()
				.replace(/\s+/g, '-') // Replace whitespace with -
				// allow-any-unicode-next-line
				.replace(/[\]\[\!\/\'\"\#\$\%\&\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\{\|\}\~\`。，、；：？！…—·ˉ¨‘’“”々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g, '') // Remove known punctuators
				.replace(/^\-+/, '') // Remove leading -
				.replace(/\-+$/, '') // Remove trailing -
		);
		return new Slug(slugifiedHeading);
	}
};
