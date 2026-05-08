# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\utils\fpsTracker.ts
# Merge Date: 2026-05-07T19:19:42.164685
# ---

export type FpsMetrics = {
  averageFps: number
  low1PctFps: number
}

export class FpsTracker {
  private frameDurations: number[] = []
  private firstRenderTime: number | undefined
  private lastRenderTime: number | undefined

  record(durationMs: number): void {
    const now = performance.now()
    if (this.firstRenderTime === undefined) {
      this.firstRenderTime = now
    }
    this.lastRenderTime = now
    this.frameDurations.push(durationMs)
  }

  getMetrics(): FpsMetrics | undefined {
    if (
      this.frameDurations.length === 0 ||
      this.firstRenderTime === undefined ||
      this.lastRenderTime === undefined
    ) {
      return undefined
    }

    const totalTimeMs = this.lastRenderTime - this.firstRenderTime
    if (totalTimeMs <= 0) {
      return undefined
    }

    const totalFrames = this.frameDurations.length
    const averageFps = totalFrames / (totalTimeMs / 1000)

    const sorted = this.frameDurations.slice().sort((a, b) => b - a)
    const p99Index = Math.max(0, Math.ceil(sorted.length * 0.01) - 1)
    const p99FrameTimeMs = sorted[p99Index]!
    const low1PctFps = p99FrameTimeMs > 0 ? 1000 / p99FrameTimeMs : 0

    return {
      averageFps: Math.round(averageFps * 100) / 100,
      low1PctFps: Math.round(low1PctFps * 100) / 100,
    }
  }
}
