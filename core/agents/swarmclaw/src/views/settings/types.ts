# MERGED FROM: mythos/swarmclaw-main
# DATE: 2026-05-08T06:26:25.045Z

import type { AppSettings } from '@/types'

export interface SettingsSectionProps {
  appSettings: AppSettings
  patchSettings: (patch: Partial<AppSettings>) => void
  inputClass: string
}
