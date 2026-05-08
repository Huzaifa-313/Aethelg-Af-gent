# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\swarm\page.js
# Merge Date: 2026-05-07T19:25:13.656465
# ---

import { auth } from 'thepopebot/auth';
import { SwarmPage } from 'thepopebot/chat';

export default async function SwarmRoute() {
  const session = await auth();
  return <SwarmPage session={session} />;
}
