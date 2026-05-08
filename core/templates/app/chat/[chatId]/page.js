# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\chat\[chatId]\page.js
# Merge Date: 2026-05-07T19:25:13.230466
# ---

import { auth } from 'thepopebot/auth';
import { ChatPage } from 'thepopebot/chat';

export default async function ChatRoute({ params }) {
  const { chatId } = await params;
  const session = await auth();
  return <ChatPage session={session} needsSetup={false} chatId={chatId} />;
}
