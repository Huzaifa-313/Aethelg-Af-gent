# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\vendor\ace-min\snippets\razor.js
# Merge Date: 2026-05-07T19:29:09.830149
# ---

define("ace/snippets/razor.snippets",["require","exports","module"],function(e,t,n){n.exports="snippet if\n(${1} == ${2}) {\n	${3}\n}"}),define("ace/snippets/razor",["require","exports","module","ace/snippets/razor.snippets"],function(e,t,n){"use strict";t.snippetText=e("./razor.snippets"),t.scope="razor"});                (function() {
                    window.require(["ace/snippets/razor"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            