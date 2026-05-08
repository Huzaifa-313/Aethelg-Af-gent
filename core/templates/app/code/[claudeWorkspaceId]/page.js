# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\code\[claudeWorkspaceId]\page.js
# Merge Date: 2026-05-07T19:25:13.276465
# ---

import { auth } from 'thepopebot/auth';
import { CodePage } from 'thepopebot/code';

export default async function CodeRoute({ params }) {
  const session = await auth();
  const { claudeWorkspaceId } = await params;
  return <CodePage session={session} claudeWorkspaceId={claudeWorkspaceId} />;
}
