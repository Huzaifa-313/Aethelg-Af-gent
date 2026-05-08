# AETHELGARD MERGED FILE
# Origin Repository: everything-claude-code-main
# Original Path: scripts\hooks\pre-write-doc-warn.js
# Merge Date: 2026-05-07T19:20:20.329224
# ---

#!/usr/bin/env node
/**
 * Backward-compatible doc warning hook entrypoint.
 * Kept for consumers that still reference pre-write-doc-warn.js directly.
 */

'use strict';

require('./doc-file-warning.js');
