# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\components\messages\process-group\process-group-dom.js
# Merge Date: 2026-05-07T19:28:31.543470
# ---

/**
 * Process group DOM utilities (no store/state)
 */
import { store as preferencesStore } from "/components/sidebar/bottom/preferences/preferences-store.js";

export function applyModeSteps(detailMode, showUtils) {
  const mode =
    detailMode ||
    preferencesStore.detailMode ||
    "current";

  const chatHistory = document.getElementById("chat-history");
  if (!chatHistory) return;

  chatHistory.dataset.detailMode = mode;

  const shouldExpand = mode !== "collapsed";
  const allMode = mode === "expanded";
  const messages = chatHistory.querySelectorAll(".process-group");
  for (let i = 0; i < messages.length; i += 1) {
    messages[i].classList.toggle("expanded", shouldExpand);

    const steps = messages[i].querySelectorAll(".process-step");
    for (let si = 0; si < steps.length; si += 1) {
      steps[si].classList.toggle("expanded", allMode);
    }
  }
}

