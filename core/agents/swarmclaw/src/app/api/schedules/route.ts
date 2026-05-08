# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { safeParseBody } from '@/lib/server/safe-parse-body'
import {
  createScheduleFromRoute,
  listSchedulesForApi,
} from '@/lib/server/schedules/schedule-route-service'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const includeArchived = searchParams.get('includeArchived') === 'true'
  return NextResponse.json(listSchedulesForApi(includeArchived))
}

export async function POST(req: Request) {
  const { data: body, error } = await safeParseBody(req)
  if (error) return error
  const result = createScheduleFromRoute(body as Record<string, unknown>)
  return result.ok
    ? NextResponse.json(result.payload)
    : NextResponse.json(result.payload, { status: result.status })
}
