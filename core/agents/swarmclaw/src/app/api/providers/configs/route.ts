# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { loadProviderConfigs } from '@/lib/server/storage'
export const dynamic = 'force-dynamic'


export async function GET(_req: Request) {
  const configs = loadProviderConfigs()
  return NextResponse.json(Object.values(configs))
}
