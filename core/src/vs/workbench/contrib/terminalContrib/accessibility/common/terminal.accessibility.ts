# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\workbench\contrib\terminalContrib\accessibility\common\terminal.accessibility.ts
# Merge Date: 2026-05-07T19:24:37.480462
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum TerminalAccessibilityCommandId {
	FocusAccessibleBuffer = 'workbench.action.terminal.focusAccessibleBuffer',
	AccessibleBufferGoToNextCommand = 'workbench.action.terminal.accessibleBufferGoToNextCommand',
	AccessibleBufferGoToPreviousCommand = 'workbench.action.terminal.accessibleBufferGoToPreviousCommand',
	ScrollToBottomAccessibleView = 'workbench.action.terminal.scrollToBottomAccessibleView',
	ScrollToTopAccessibleView = 'workbench.action.terminal.scrollToTopAccessibleView',
}

export const defaultTerminalAccessibilityCommandsToSkipShell = [
	TerminalAccessibilityCommandId.FocusAccessibleBuffer
];
