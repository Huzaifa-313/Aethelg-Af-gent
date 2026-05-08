# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\plugins\_time_travel\extensions\webui\apply_snapshot_before\refresh-time-travel.js
# Merge Date: 2026-05-07T19:28:10.179395
# ---

export default function refreshTimeTravelOnContextChange(ctx) {
  const store = globalThis.Alpine?.store?.("timeTravel");
  const modalOpen = globalThis.isModalOpen?.("/plugins/_time_travel/webui/main.html")
    || globalThis.isModalOpen?.("plugins/_time_travel/webui/main.html");
  if (!store || !modalOpen) return;
  const nextContextId = String(ctx?.snapshot?.context || "");
  if (nextContextId && nextContextId !== store.contextId) {
    store.scheduleRefresh({ contextId: nextContextId, reason: "context-change" });
  }
}
