# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { getChannels } from '@/lib/swarmfeed-client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const channels = await getChannels()
    return NextResponse.json({ channels })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch channels'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
