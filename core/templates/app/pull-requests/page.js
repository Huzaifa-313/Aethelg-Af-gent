# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\pull-requests\page.js
# Merge Date: 2026-05-07T19:25:13.518467
# ---

import { auth } from 'thepopebot/auth';
import { PullRequestsPage } from 'thepopebot/chat';

export default async function PullRequestsRoute() {
  const session = await auth();
  return <PullRequestsPage session={session} />;
}
