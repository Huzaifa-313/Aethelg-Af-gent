# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\api\browser\mainThreadAiEmbeddingVector.ts
# Merge Date: 2026-05-07T19:23:42.036948
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { ExtHostAiEmbeddingVectorShape, ExtHostContext, MainContext, MainThreadAiEmbeddingVectorShape } from '../common/extHost.protocol.js';
import { IAiEmbeddingVectorProvider, IAiEmbeddingVectorService } from '../../services/aiEmbeddingVector/common/aiEmbeddingVectorService.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';

@extHostNamedCustomer(MainContext.MainThreadAiEmbeddingVector)
export class MainThreadAiEmbeddingVector extends Disposable implements MainThreadAiEmbeddingVectorShape {
	private readonly _proxy: ExtHostAiEmbeddingVectorShape;
	private readonly _registrations = this._register(new DisposableMap<number>());

	constructor(
		context: IExtHostContext,
		@IAiEmbeddingVectorService private readonly _AiEmbeddingVectorService: IAiEmbeddingVectorService,
	) {
		super();
		this._proxy = context.getProxy(ExtHostContext.ExtHostAiEmbeddingVector);
	}

	$registerAiEmbeddingVectorProvider(model: string, handle: number): void {
		const provider: IAiEmbeddingVectorProvider = {
			provideAiEmbeddingVector: (strings: string[], token: CancellationToken) => {
				return this._proxy.$provideAiEmbeddingVector(
					handle,
					strings,
					token
				);
			},
		};
		this._registrations.set(handle, this._AiEmbeddingVectorService.registerAiEmbeddingVectorProvider(model, provider));
	}

	$unregisterAiEmbeddingVectorProvider(handle: number): void {
		this._registrations.deleteAndDispose(handle);
	}
}
