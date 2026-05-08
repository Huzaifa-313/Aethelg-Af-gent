# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\extensions\webui\webui_ws_push\clear_cache.js
# Merge Date: 2026-05-07T19:27:00.353979
# ---

import { clear, clear_all } from "/js/cache.js";

export default async function clearCache(eventType, envelope) {
  try {
    // clear frontend cache areas when backend caches are cleared via API
    if (eventType == "clear_cache") {
      const areas = envelope?.data?.areas || [];
      console.log("Clearing caches", areas);
      if (areas.length > 0) {
        for (const area of areas) {
          clear(area);
        }
      } else {
        // clear all caches
        clear_all();
      }
    }
  } catch (e) {
    console.error(e);
  }
}
