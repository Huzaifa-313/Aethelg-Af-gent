# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\components\sidebar\bottom\sidebar-bottom-store.js
# Merge Date: 2026-05-07T19:28:35.085471
# ---

import { createStore } from "/js/AlpineStore.js";

// Sidebar Bottom store manages version info display
const model = {
  versionNo: "",
  commitTime: "",

  get versionLabel() {
    return this.versionNo && this.commitTime
      ? `Version ${this.versionNo} ${this.commitTime}`
      : "";
  },

  init() {
    // Load version info from global scope (exposed in index.html)
    const gi = globalThis.gitinfo;
    if (gi && gi.version && gi.commit_time) {
      this.versionNo = gi.version;
      this.commitTime = gi.commit_time;
    }
  },
};

export const store = createStore("sidebarBottom", model);

