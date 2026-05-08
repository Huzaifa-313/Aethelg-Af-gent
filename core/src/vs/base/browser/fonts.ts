# AETHELGARD MERGED FILE
# Origin Repository: pearai-app-main
# Original Path: src\vs\base\browser\fonts.ts
# Merge Date: 2026-05-07T19:22:39.886376
# ---

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isMacintosh, isWindows } from '../common/platform.js';

/**
 * The best font-family to be used in CSS based on the platform:
 * - Windows: Segoe preferred, fallback to sans-serif
 * - macOS: standard system font, fallback to sans-serif
 * - Linux: standard system font preferred, fallback to Ubuntu fonts
 *
 * Note: this currently does not adjust for different locales.
 */
export const DEFAULT_FONT_FAMILY = isWindows ? '"Segoe WPC", "Segoe UI", sans-serif' : isMacintosh ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'system-ui, "Ubuntu", "Droid Sans", sans-serif';
