# AETHELGARD MERGED FILE
# Origin Repository: claude-code-leaked
# Original Path: source code\ink\events\event.ts
# Merge Date: 2026-05-07T19:15:54.318456
# ---

// https://github.com/AnukarOP

export class Event {
  private _didStopImmediatePropagation = false

  didStopImmediatePropagation(): boolean {
    return this._didStopImmediatePropagation
  }

  stopImmediatePropagation(): void {
    this._didStopImmediatePropagation = true
  }
}
