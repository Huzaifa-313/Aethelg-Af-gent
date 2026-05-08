# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\configExporter\electron-sandbox\configurationExportHelper.contribution.ts
# Merge Date: 2026-05-07T19:24:03.697944
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-sandbox/environmentService.js';
import { DefaultConfigurationExportHelper } from './configurationExportHelper.js';

export class ExtensionPoints implements IWorkbenchContribution {

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService
	) {
		// Config Exporter
		if (environmentService.args['export-default-configuration']) {
			instantiationService.createInstance(DefaultConfigurationExportHelper);
		}
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(ExtensionPoints, LifecyclePhase.Restored);
