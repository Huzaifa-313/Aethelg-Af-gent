# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { listUnifiedRuns } from '@/lib/server/runs/unified-run-queries'
import type { SessionRunStatus } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId') || undefined
  const status = (searchParams.get('status') || undefined) as SessionRunStatus | undefined
  const limitRaw = searchParams.get('limit')
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined

  return NextResponse.json(listUnifiedRuns({ sessionId, status, limit }))
}
