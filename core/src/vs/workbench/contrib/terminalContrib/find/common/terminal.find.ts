# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminalContrib\find\common\terminal.find.ts
# Merge Date: 2026-05-07T19:24:38.186463
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalFindCommandId {
	FindFocus = 'workbench.action.terminal.focusFind',
	FindHide = 'workbench.action.terminal.hideFind',
	FindNext = 'workbench.action.terminal.findNext',
	FindPrevious = 'workbench.action.terminal.findPrevious',
	ToggleFindRegex = 'workbench.action.terminal.toggleFindRegex',
	ToggleFindWholeWord = 'workbench.action.terminal.toggleFindWholeWord',
	ToggleFindCaseSensitive = 'workbench.action.terminal.toggleFindCaseSensitive',
	SearchWorkspace = 'workbench.action.terminal.searchWorkspace',
}

export const defaultTerminalFindCommandToSkipShell = [
	TerminalFindCommandId.FindFocus,
	TerminalFindCommandId.FindHide,
	TerminalFindCommandId.FindNext,
	TerminalFindCommandId.FindPrevious,
	TerminalFindCommandId.ToggleFindRegex,
	TerminalFindCommandId.ToggleFindWholeWord,
	TerminalFindCommandId.ToggleFindCaseSensitive,
	TerminalFindCommandId.SearchWorkspace,
];
