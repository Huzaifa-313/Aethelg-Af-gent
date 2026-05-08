# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'

import { listLearnedSkills } from '@/lib/server/skills/learned-skills'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const agentId = url.searchParams.get('agentId') || undefined
  const sessionId = url.searchParams.get('sessionId') || undefined
  const lifecycle = url.searchParams.get('lifecycle') || undefined

  return NextResponse.json(listLearnedSkills({
    agentId,
    sessionId,
    lifecycle: lifecycle === 'candidate'
      || lifecycle === 'active'
      || lifecycle === 'shadow'
      || lifecycle === 'demoted'
      || lifecycle === 'review_ready'
      ? lifecycle
      : undefined,
  }))
}
