# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { getDeviceId } from '@/lib/providers/openclaw'
export const dynamic = 'force-dynamic'


export async function GET(_req: Request) {
  try {
    const deviceId = getDeviceId()
    return NextResponse.json({ deviceId })
  } catch (err: unknown) {
    return NextResponse.json({ deviceId: null, error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
