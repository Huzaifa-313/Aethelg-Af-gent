# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { localIP } from '@/lib/server/runtime/network'
export const dynamic = 'force-dynamic'


export async function GET() {
  return NextResponse.json({ ip: localIP(), port: parseInt(process.env.PORT || '3000') })
}
