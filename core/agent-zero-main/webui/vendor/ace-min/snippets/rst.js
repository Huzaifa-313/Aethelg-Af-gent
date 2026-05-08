# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\vendor\ace-min\snippets\rst.js
# Merge Date: 2026-05-07T19:29:09.941104
# ---

define("ace/snippets/rst.snippets",["require","exports","module"],function(e,t,n){n.exports="# rst\n\nsnippet :\n	:${1:field name}: ${2:field body}\nsnippet *\n	*${1:Emphasis}*\nsnippet **\n	**${1:Strong emphasis}**\nsnippet _\n	\\`${1:hyperlink-name}\\`_\n	.. _\\`$1\\`: ${2:link-block}\nsnippet =\n	${1:Title}\n	=====${2:=}\n	${3}\nsnippet -\n	${1:Title}\n	-----${2:-}\n	${3}\nsnippet cont:\n	.. contents::\n	\n"}),define("ace/snippets/rst",["require","exports","module","ace/snippets/rst.snippets"],function(e,t,n){"use strict";t.snippetText=e("./rst.snippets"),t.scope="rst"});                (function() {
                    window.require(["ace/snippets/rst"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            