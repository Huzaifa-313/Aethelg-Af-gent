# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: vendor\sdk\_shims\bun-runtime.js
# Merge Date: 2026-05-07T19:17:50.805139
# ---

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntime = void 0;
const web_runtime_1 = require("./web-runtime.js");
const node_fs_1 = require("node:fs");
function getRuntime() {
    const runtime = (0, web_runtime_1.getRuntime)();
    function isFsReadStream(value) {
        return value instanceof node_fs_1.ReadStream;
    }
    return { ...runtime, isFsReadStream };
}
exports.getRuntime = getRuntime;
//# sourceMappingURL=bun-runtime.js.map