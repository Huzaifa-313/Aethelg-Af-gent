# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\crons\page.js
# Merge Date: 2026-05-07T19:25:13.459467
# ---

import { redirect } from 'next/navigation';

export default function CronsRoute() {
  redirect('/settings/crons');
}
