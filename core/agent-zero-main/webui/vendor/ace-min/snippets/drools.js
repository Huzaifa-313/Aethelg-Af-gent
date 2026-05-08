# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\webui\vendor\ace-min\snippets\drools.js
# Merge Date: 2026-05-07T19:29:03.869549
# ---

define("ace/snippets/drools.snippets",["require","exports","module"],function(e,t,n){n.exports='\nsnippet rule\n	rule "${1?:rule_name}"\n	when\n		${2:// when...} \n	then\n		${3:// then...}\n	end\n\nsnippet query\n	query ${1?:query_name}\n		${2:// find} \n	end\n	\nsnippet declare\n	declare ${1?:type_name}\n		${2:// attributes} \n	end\n\n'}),define("ace/snippets/drools",["require","exports","module","ace/snippets/drools.snippets"],function(e,t,n){"use strict";t.snippetText=e("./drools.snippets"),t.scope="drools"});                (function() {
                    window.require(["ace/snippets/drools"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            