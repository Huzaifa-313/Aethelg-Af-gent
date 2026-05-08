# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\settings\layout.js
# Merge Date: 2026-05-07T19:25:13.541467
# ---

import { auth } from 'thepopebot/auth';
import { SettingsLayout } from 'thepopebot/chat';

export default async function Layout({ children }) {
  const session = await auth();
  return <SettingsLayout session={session}>{children}</SettingsLayout>;
}
