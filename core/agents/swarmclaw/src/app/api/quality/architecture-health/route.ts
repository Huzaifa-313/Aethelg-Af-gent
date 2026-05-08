# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { buildArchitectureHealthReport } from '@/lib/quality/architecture-health'
import { errorMessage } from '@/lib/shared-utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json(buildArchitectureHealthReport())
  } catch (err: unknown) {
    return NextResponse.json(
      { error: errorMessage(err) },
      { status: 500 },
    )
  }
}
