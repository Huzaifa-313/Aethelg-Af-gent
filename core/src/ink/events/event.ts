# AETHELGARD MERGED FILE
# Origin Repository: claude-code0
# Original Path: src\ink\events\event.ts
# Merge Date: 2026-05-07T19:16:59.372456
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

