# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\vendor\ace-min\snippets\forth.js
# Merge Date: 2026-05-07T19:29:04.260551
# ---

;                (function() {
                    window.require(["ace/snippets/forth"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            