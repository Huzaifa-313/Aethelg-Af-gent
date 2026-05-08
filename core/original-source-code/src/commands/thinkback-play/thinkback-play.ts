# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: original-source-code\src\commands\thinkback-play\thinkback-play.ts
# Merge Date: 2026-05-07T19:19:12.427688
# ---

import { join } from 'path'
import type { LocalCommandResult } from '../../commands.js'
import { loadInstalledPluginsV2 } from '../../utils/plugins/installedPluginsManager.js'
import { OFFICIAL_MARKETPLACE_NAME } from '../../utils/plugins/officialMarketplace.js'
import { playAnimation } from '../thinkback/thinkback.js'

const INTERNAL_MARKETPLACE_NAME = 'claude-code-marketplace'
const SKILL_NAME = 'thinkback'

function getPluginId(): string {
  const marketplaceName =
    process.env.USER_TYPE === 'ant'
      ? INTERNAL_MARKETPLACE_NAME
      : OFFICIAL_MARKETPLACE_NAME
  return `thinkback@${marketplaceName}`
}

export async function call(): Promise<LocalCommandResult> {
  // Get skill directory from installed plugins config
  const v2Data = loadInstalledPluginsV2()
  const pluginId = getPluginId()
  const installations = v2Data.plugins[pluginId]

  if (!installations || installations.length === 0) {
    return {
      type: 'text' as const,
      value:
        'Thinkback plugin not installed. Run /think-back first to install it.',
    }
  }

  const firstInstall = installations[0]
  if (!firstInstall?.installPath) {
    return {
      type: 'text' as const,
      value: 'Thinkback plugin installation path not found.',
    }
  }

  const skillDir = join(firstInstall.installPath, 'skills', SKILL_NAME)
  const result = await playAnimation(skillDir)
  return { type: 'text' as const, value: result.message }
}
