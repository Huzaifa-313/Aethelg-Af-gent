# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\common\parsers.ts
# Merge Date: 2026-05-07T19:22:45.215394
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum ValidationState {
	OK = 0,
	Info = 1,
	Warning = 2,
	Error = 3,
	Fatal = 4
}

export class ValidationStatus {
	private _state: ValidationState;

	constructor() {
		this._state = ValidationState.OK;
	}

	public get state(): ValidationState {
		return this._state;
	}

	public set state(value: ValidationState) {
		if (value > this._state) {
			this._state = value;
		}
	}

	public isOK(): boolean {
		return this._state === ValidationState.OK;
	}

	public isFatal(): boolean {
		return this._state === ValidationState.Fatal;
	}
}

export interface IProblemReporter {
	info(message: string): void;
	warn(message: string): void;
	error(message: string): void;
	fatal(message: string): void;
	status: ValidationStatus;
}

export abstract class Parser {

	private _problemReporter: IProblemReporter;

	constructor(problemReporter: IProblemReporter) {
		this._problemReporter = problemReporter;
	}

	public reset(): void {
		this._problemReporter.status.state = ValidationState.OK;
	}

	public get problemReporter(): IProblemReporter {
		return this._problemReporter;
	}

	public info(message: string): void {
		this._problemReporter.info(message);
	}

	public warn(message: string): void {
		this._problemReporter.warn(message);
	}

	public error(message: string): void {
		this._problemReporter.error(message);
	}

	public fatal(message: string): void {
		this._problemReporter.fatal(message);
	}
}