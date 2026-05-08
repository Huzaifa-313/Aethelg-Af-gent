# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: vendor\sdk\_shims\MultipartBody.js
# Merge Date: 2026-05-07T19:17:50.941128
# ---

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipartBody = void 0;
/**
 * Disclaimer: modules in _shims aren't intended to be imported by SDK users.
 */
class MultipartBody {
    constructor(body) {
        this.body = body;
    }
    get [Symbol.toStringTag]() {
        return 'MultipartBody';
    }
}
exports.MultipartBody = MultipartBody;
//# sourceMappingURL=MultipartBody.js.map