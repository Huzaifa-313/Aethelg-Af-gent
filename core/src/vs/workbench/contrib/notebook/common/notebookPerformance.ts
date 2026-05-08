# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\notebook\common\notebookPerformance.ts
# Merge Date: 2026-05-07T19:24:20.297948
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type PerfName = 'startTime' | 'extensionActivated' | 'inputLoaded' | 'webviewCommLoaded' | 'customMarkdownLoaded' | 'editorLoaded';

type PerformanceMark = { [key in PerfName]?: number };

export class NotebookPerfMarks {
	private _marks: PerformanceMark = {};

	get value(): PerformanceMark {
		return { ...this._marks };
	}

	mark(name: PerfName): void {
		if (this._marks[name]) {
			console.error(`Skipping overwrite of notebook perf value: ${name}`);
			return;
		}

		this._marks[name] = Date.now();
	}
}
