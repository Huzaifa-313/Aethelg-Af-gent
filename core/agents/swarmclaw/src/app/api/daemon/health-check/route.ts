# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { runDaemonHealthCheckViaAdmin } from '@/lib/server/daemon/controller'

export async function POST() {
  const snapshot = await runDaemonHealthCheckViaAdmin('api/daemon/health-check:post')
  return NextResponse.json({
    ok: true,
    status: snapshot.status,
  })
}
