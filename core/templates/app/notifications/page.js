# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\notifications\page.js
# Merge Date: 2026-05-07T19:25:13.495465
# ---

import { auth } from 'thepopebot/auth';
import { NotificationsPage } from 'thepopebot/chat';

export default async function NotificationsRoute() {
  const session = await auth();
  return <NotificationsPage session={session} />;
}
