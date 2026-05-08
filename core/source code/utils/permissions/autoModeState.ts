# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\utils\permissions\autoModeState.ts
# Merge Date: 2026-05-07T19:16:23.350455
# ---

// https://github.com/AnukarOP

// Auto mode state functions — lives in its own module so callers can
// conditionally require() it on feature('TRANSCRIPT_CLASSIFIER').

let autoModeActive = false
let autoModeFlagCli = false
// Set by the async verifyAutoModeGateAccess check when it
// reads a fresh tengu_auto_mode_config.enabled === 'disabled' from GrowthBook.
// Used by isAutoModeGateEnabled() to block SDK/explicit re-entry after kick-out.
let autoModeCircuitBroken = false

export function setAutoModeActive(active: boolean): void {
  autoModeActive = active
}

export function isAutoModeActive(): boolean {
  return autoModeActive
}

export function setAutoModeFlagCli(passed: boolean): void {
  autoModeFlagCli = passed
}

export function getAutoModeFlagCli(): boolean {
  return autoModeFlagCli
}

export function setAutoModeCircuitBroken(broken: boolean): void {
  autoModeCircuitBroken = broken
}

export function isAutoModeCircuitBroken(): boolean {
  return autoModeCircuitBroken
}

export function _resetForTesting(): void {
  autoModeActive = false
  autoModeFlagCli = false
  autoModeCircuitBroken = false
}
