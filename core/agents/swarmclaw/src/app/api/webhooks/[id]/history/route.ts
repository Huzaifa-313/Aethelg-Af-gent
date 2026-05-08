# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { loadWebhookLogs } from '@/lib/server/storage'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const allLogs = loadWebhookLogs()
  const entries = Object.values(allLogs)
    .filter((entry) => (entry as Record<string, unknown>).webhookId === id)
    .sort((a, b) => ((b as Record<string, unknown>).timestamp as number || 0) - ((a as Record<string, unknown>).timestamp as number || 0))
    .slice(0, 100)

  return NextResponse.json(entries)
}
