# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\github\src\remoteSourcePublisher.ts
# Merge Date: 2026-05-07T19:22:06.059304
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { publishRepository } from './publish';
import { API as GitAPI, RemoteSourcePublisher, Repository } from './typings/git';

export class GithubRemoteSourcePublisher implements RemoteSourcePublisher {
	readonly name = 'GitHub';
	readonly icon = 'github';

	constructor(private gitAPI: GitAPI) { }

	publishRepository(repository: Repository): Promise<void> {
		return publishRepository(this.gitAPI, repository);
	}
}
