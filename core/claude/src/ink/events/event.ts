# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: claude\src\ink\events\event.ts
# Merge Date: 2026-05-07T19:14:53.489455
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
