# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\vendor\ace-min\snippets\nsis.js
# Merge Date: 2026-05-07T19:29:09.009103
# ---

;                (function() {
                    window.require(["ace/snippets/nsis"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            