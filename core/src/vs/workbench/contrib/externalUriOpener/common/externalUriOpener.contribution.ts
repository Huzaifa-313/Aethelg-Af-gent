# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\externalUriOpener\common\externalUriOpener.contribution.ts
# Merge Date: 2026-05-07T19:24:09.457946
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { externalUriOpenersConfigurationNode } from './configuration.js';
import { ExternalUriOpenerService, IExternalUriOpenerService } from './externalUriOpenerService.js';

registerSingleton(IExternalUriOpenerService, ExternalUriOpenerService, InstantiationType.Delayed);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerConfiguration(externalUriOpenersConfigurationNode);
