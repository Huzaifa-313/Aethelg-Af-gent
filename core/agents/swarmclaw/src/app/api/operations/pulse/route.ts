# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { getOperationPulse, normalizeOperationPulseRange } from '@/lib/server/operations/operation-pulse'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  return NextResponse.json(getOperationPulse(normalizeOperationPulseRange(searchParams.get('range'))))
}
