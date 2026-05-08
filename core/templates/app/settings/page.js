# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\settings\page.js
# Merge Date: 2026-05-07T19:25:13.558464
# ---

import { redirect } from 'next/navigation';

export default function SettingsRoot() {
  redirect('/settings/crons');
}
