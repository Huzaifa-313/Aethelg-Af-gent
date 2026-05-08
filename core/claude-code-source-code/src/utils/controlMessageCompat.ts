# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: claude-code-source-code\src\utils\controlMessageCompat.ts
# Merge Date: 2026-05-07T19:18:32.254686
# ---

/**
 * Normalize camelCase `requestId` → snake_case `request_id` on incoming
 * control messages (control_request, control_response).
 *
 * Older iOS app builds send `requestId` due to a missing Swift CodingKeys
 * mapping. Without this shim, `isSDKControlRequest` in replBridge.ts rejects
 * the message (it checks `'request_id' in value`), and structuredIO.ts reads
 * `message.response.request_id` as undefined — both silently drop the message.
 *
 * If both `request_id` and `requestId` are present, snake_case wins.
 * Mutates the object in place.
 */
export function normalizeControlMessageKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj
  const record = obj as Record<string, unknown>
  if ('requestId' in record && !('request_id' in record)) {
    record.request_id = record.requestId
    delete record.requestId
  }
  if (
    'response' in record &&
    record.response !== null &&
    typeof record.response === 'object'
  ) {
    const response = record.response as Record<string, unknown>
    if ('requestId' in response && !('request_id' in response)) {
      response.request_id = response.requestId
      delete response.requestId
    }
  }
  return obj
}
