# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminalContrib\suggest\common\terminal.suggest.ts
# Merge Date: 2026-05-07T19:24:39.613462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalSuggestCommandId {
	SelectPrevSuggestion = 'workbench.action.terminal.selectPrevSuggestion',
	SelectPrevPageSuggestion = 'workbench.action.terminal.selectPrevPageSuggestion',
	SelectNextSuggestion = 'workbench.action.terminal.selectNextSuggestion',
	SelectNextPageSuggestion = 'workbench.action.terminal.selectNextPageSuggestion',
	AcceptSelectedSuggestion = 'workbench.action.terminal.acceptSelectedSuggestion',
	AcceptSelectedSuggestionEnter = 'workbench.action.terminal.acceptSelectedSuggestionEnter',
	HideSuggestWidget = 'workbench.action.terminal.hideSuggestWidget',
	ClearSuggestCache = 'workbench.action.terminal.clearSuggestCache',
	RequestCompletions = 'workbench.action.terminal.requestCompletions',
}

export const defaultTerminalSuggestCommandsToSkipShell = [
	TerminalSuggestCommandId.SelectPrevSuggestion,
	TerminalSuggestCommandId.SelectPrevPageSuggestion,
	TerminalSuggestCommandId.SelectNextSuggestion,
	TerminalSuggestCommandId.SelectNextPageSuggestion,
	TerminalSuggestCommandId.AcceptSelectedSuggestion,
	TerminalSuggestCommandId.AcceptSelectedSuggestionEnter,
	TerminalSuggestCommandId.HideSuggestWidget,
	TerminalSuggestCommandId.ClearSuggestCache,
	TerminalSuggestCommandId.RequestCompletions,
];
