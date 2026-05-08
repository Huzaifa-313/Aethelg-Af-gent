# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\common\component.ts
# Merge Date: 2026-05-07T19:23:54.858948
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Memento, MementoObject } from './memento.js';
import { IThemeService, Themable } from '../../platform/theme/common/themeService.js';
import { IStorageService, IStorageValueChangeEvent, StorageScope, StorageTarget } from '../../platform/storage/common/storage.js';
import { DisposableStore } from '../../base/common/lifecycle.js';
import { Event } from '../../base/common/event.js';

export class Component extends Themable {

	private readonly memento: Memento;

	constructor(
		private readonly id: string,
		themeService: IThemeService,
		storageService: IStorageService
	) {
		super(themeService);

		this.memento = new Memento(this.id, storageService);

		this._register(storageService.onWillSaveState(() => {

			// Ask the component to persist state into the memento
			this.saveState();

			// Then save the memento into storage
			this.memento.saveMemento();
		}));
	}

	getId(): string {
		return this.id;
	}

	protected getMemento(scope: StorageScope, target: StorageTarget): MementoObject {
		return this.memento.getMemento(scope, target);
	}

	protected reloadMemento(scope: StorageScope): void {
		return this.memento.reloadMemento(scope);
	}

	protected onDidChangeMementoValue(scope: StorageScope, disposables: DisposableStore): Event<IStorageValueChangeEvent> {
		return this.memento.onDidChangeValue(scope, disposables);
	}

	protected saveState(): void {
		// Subclasses to implement for storing state
	}
}
