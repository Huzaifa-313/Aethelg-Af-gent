# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\terminal-suggest\src\completions\cd.ts
# Merge Date: 2026-05-07T19:22:24.994375
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const cdSpec: Fig.Spec = {
	name: 'cd',
	description: 'Change the shell working directory',
	args: {
		name: 'folder',
		template: 'folders',

		suggestions: [
			{
				name: '-',
				description: 'Switch to the last used folder',
				hidden: true,
			},
			{
				name: '~',
				description: 'Switch to the home directory',
				hidden: true,
			},
		],
	}
};

export default cdSpec;
