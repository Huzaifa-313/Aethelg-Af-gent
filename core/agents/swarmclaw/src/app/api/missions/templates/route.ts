# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { listMissionTemplates } from '@/lib/server/missions/mission-templates'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(listMissionTemplates())
}
