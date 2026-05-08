# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\components\chat\top-section\chat-top-store.js
# Merge Date: 2026-05-07T19:28:31.423470
# ---

import { createStore } from "/js/AlpineStore.js";

// define the model object holding data and functions
const model = {
  connected: false,
  progressActive: false,  // true when progress bar is active
};

// convert it to alpine store
const store = createStore("chatTop", model);

// export for use in other files
export { store };
