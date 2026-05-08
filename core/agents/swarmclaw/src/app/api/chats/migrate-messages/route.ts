# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { migrateAllSessions } from '@/lib/server/messages/message-repository'

export async function POST() {
  const result = migrateAllSessions()
  return NextResponse.json(result)
}
