# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\ink\events\event.ts
# Merge Date: 2026-05-07T19:19:29.823686
# ---

export class Event {
  private _didStopImmediatePropagation = false

  didStopImmediatePropagation(): boolean {
    return this._didStopImmediatePropagation
  }

  stopImmediatePropagation(): void {
    this._didStopImmediatePropagation = true
  }
}
