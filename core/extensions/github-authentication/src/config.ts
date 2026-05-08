# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: extensions\github-authentication\src\config.ts
# Merge Date: 2026-05-07T19:22:06.518307
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IConfig {
	// The client ID of the GitHub OAuth app
	gitHubClientId: string;
	gitHubClientSecret?: string;
}

// For easy access to mixin client ID and secret
export const Config: IConfig = {
	gitHubClientId: '01ab8ac9400c4e429b23'
};
