# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\authPortable.ts
# Merge Date: 2026-05-07T19:18:31.305706
# ---

import { execa } from 'execa'
import { getMacOsKeychainStorageServiceName } from 'src/utils/secureStorage/macOsKeychainHelpers.js'

export async function maybeRemoveApiKeyFromMacOSKeychainThrows(): Promise<void> {
  if (process.platform === 'darwin') {
    const storageServiceName = getMacOsKeychainStorageServiceName()
    const result = await execa(
      `security delete-generic-password -a $USER -s "${storageServiceName}"`,
      { shell: true, reject: false },
    )
    if (result.exitCode !== 0) {
      throw new Error('Failed to delete keychain entry')
    }
  }
}

export function normalizeApiKeyForConfig(apiKey: string): string {
  return apiKey.slice(-20)
}
