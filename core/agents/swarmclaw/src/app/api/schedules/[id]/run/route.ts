# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { notFound } from '@/lib/server/collection-helpers'
import { runScheduleNow } from '@/lib/server/schedules/schedule-route-service'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = runScheduleNow(id)
  if (!result.ok && result.status === 404) return notFound()
  return result.ok
    ? NextResponse.json(result.payload)
    : NextResponse.json(result.payload, { status: result.status })
}
