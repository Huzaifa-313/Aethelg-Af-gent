# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\chats\page.js
# Merge Date: 2026-05-07T19:25:13.254465
# ---

import { auth } from 'thepopebot/auth';
import { ChatsPage } from 'thepopebot/chat';

export default async function ChatsRoute() {
  const session = await auth();
  return <ChatsPage session={session} />;
}
