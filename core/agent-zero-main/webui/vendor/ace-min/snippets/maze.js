# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\vendor\ace-min\snippets\maze.js
# Merge Date: 2026-05-07T19:29:08.564582
# ---

define("ace/snippets/maze.snippets",["require","exports","module"],function(e,t,n){n.exports="snippet >\ndescription assignment\nscope maze\n	-> ${1}= ${2}\n\nsnippet >\ndescription if\nscope maze\n	-> IF ${2:**} THEN %${3:L} ELSE %${4:R}\n"}),define("ace/snippets/maze",["require","exports","module","ace/snippets/maze.snippets"],function(e,t,n){"use strict";t.snippetText=e("./maze.snippets"),t.scope="maze"});                (function() {
                    window.require(["ace/snippets/maze"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            