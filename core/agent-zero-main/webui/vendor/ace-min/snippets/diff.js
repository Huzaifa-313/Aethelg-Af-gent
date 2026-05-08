# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\vendor\ace-min\snippets\diff.js
# Merge Date: 2026-05-07T19:29:03.647549
# ---

define("ace/snippets/diff.snippets",["require","exports","module"],function(e,t,n){n.exports='# DEP-3 (http://dep.debian.net/deps/dep3/) style patch header\nsnippet header DEP-3 style header\n	Description: ${1}\n	Origin: ${2:vendor|upstream|other}, ${3:url of the original patch}\n	Bug: ${4:url in upstream bugtracker}\n	Forwarded: ${5:no|not-needed|url}\n	Author: ${6:`g:snips_author`}\n	Reviewed-by: ${7:name and email}\n	Last-Update: ${8:`strftime("%Y-%m-%d")`}\n	Applied-Upstream: ${9:upstream version|url|commit}\n\n'}),define("ace/snippets/diff",["require","exports","module","ace/snippets/diff.snippets"],function(e,t,n){"use strict";t.snippetText=e("./diff.snippets"),t.scope="diff"});                (function() {
                    window.require(["ace/snippets/diff"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            