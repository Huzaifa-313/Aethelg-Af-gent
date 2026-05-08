# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\page.js
# Merge Date: 2026-05-07T19:25:13.165466
# ---

import { auth } from 'thepopebot/auth';
import { ChatPage } from 'thepopebot/chat';

export default async function Home() {
  const session = await auth();
  return <ChatPage session={session} needsSetup={false} />;
}
