# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: vendor\sdk\src\_shims\index.js
# Merge Date: 2026-05-07T19:17:50.509122
# ---

/**
 * Disclaimer: modules in _shims aren't intended to be imported by SDK users.
 */
const shims = require('./registry');
const auto = require('@anthropic-ai/sdk/_shims/auto/runtime');
if (!shims.kind) shims.setShims(auto.getRuntime(), { auto: true });
for (const property of Object.keys(shims)) {
  Object.defineProperty(exports, property, {
    get() {
      return shims[property];
    },
  });
}
