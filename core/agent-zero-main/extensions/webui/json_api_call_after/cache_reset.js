# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\webui\json_api_call_after\cache_reset.js
# Merge Date: 2026-05-07T19:27:00.249980
# ---

import { clear } from "/js/cache.js";

export default async function resetCache(ctx) {
  try {
    // clear frontend cache areas when backend caches are cleared via API
    if (ctx.endpoint == "cache_reset") {
      for (const area of ctx.data.areas) {
        clear(area);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
