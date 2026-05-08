# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\editSessions\common\editSessionsLogService.ts
# Merge Date: 2026-05-07T19:24:07.422967
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { joinPath } from '../../../../base/common/resources.js';
import { localize } from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { AbstractLogger, ILogger, ILoggerService } from '../../../../platform/log/common/log.js';
import { IEditSessionsLogService, editSessionsLogId } from './editSessions.js';

export class EditSessionsLogService extends AbstractLogger implements IEditSessionsLogService {

	declare readonly _serviceBrand: undefined;
	private readonly logger: ILogger;

	constructor(
		@ILoggerService loggerService: ILoggerService,
		@IEnvironmentService environmentService: IEnvironmentService
	) {
		super();
		this.logger = this._register(loggerService.createLogger(joinPath(environmentService.logsHome, `${editSessionsLogId}.log`), { id: editSessionsLogId, name: localize('cloudChangesLog', "Cloud Changes") }));
	}

	trace(message: string, ...args: any[]): void {
		this.logger.trace(message, ...args);
	}

	debug(message: string, ...args: any[]): void {
		this.logger.debug(message, ...args);
	}

	info(message: string, ...args: any[]): void {
		this.logger.info(message, ...args);
	}

	warn(message: string, ...args: any[]): void {
		this.logger.warn(message, ...args);
	}

	error(message: string | Error, ...args: any[]): void {
		this.logger.error(message, ...args);
	}

	flush(): void {
		this.logger.flush();
	}
}
