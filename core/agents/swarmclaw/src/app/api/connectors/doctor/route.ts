# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { buildConnectorDoctorPreview, buildConnectorDoctorReport, type ConnectorDoctorPreviewInput } from '@/lib/server/connectors/doctor'
import { loadConnectors } from '@/lib/server/connectors/connector-repository'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({})) as ConnectorDoctorPreviewInput
  const connectors = loadConnectors()
  const baseConnector = typeof body.id === 'string' ? connectors[body.id] : null
  const connector = buildConnectorDoctorPreview({ baseConnector, input: body })
  return NextResponse.json(buildConnectorDoctorReport(connector, body.sampleMsg, { baseConnector }))
}
