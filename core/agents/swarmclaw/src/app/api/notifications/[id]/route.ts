# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import { NextResponse } from 'next/server'
import { loadNotifications, markNotificationRead, deleteNotification } from '@/lib/server/storage'
import { notify } from '@/lib/server/ws-hub'

export async function PUT(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const all = loadNotifications()
  if (!all[id]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  markNotificationRead(id)
  notify('notifications')
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const all = loadNotifications()
  if (!all[id]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  deleteNotification(id)
  notify('notifications')
  return NextResponse.json({ ok: true })
}
