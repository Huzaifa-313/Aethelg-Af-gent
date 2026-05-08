# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\services\userActivity\common\userActivityRegistry.ts
# Merge Date: 2026-05-07T19:25:00.590464
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserActivityService } from './userActivityService.js';

class UserActivityRegistry {
	private todo: { new(s: IUserActivityService, ...args: any[]): unknown }[] = [];

	public add = (ctor: { new(s: IUserActivityService, ...args: any[]): unknown }) => {
		this.todo.push(ctor);
	};

	public take(userActivityService: IUserActivityService, instantiation: IInstantiationService) {
		this.add = ctor => instantiation.createInstance(ctor, userActivityService);
		this.todo.forEach(this.add);
		this.todo = [];
	}
}

export const userActivityRegistry = new UserActivityRegistry();
