# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: vendor\sdk\internal\decoders\jsonl.d.ts
# Merge Date: 2026-05-07T19:17:47.932125
# ---

                              
import { type Response } from "../../_shims/index.js";
import { type Bytes } from "./line.js";
export declare class JSONLDecoder<T> {
    private iterator;
    controller: AbortController;
    constructor(iterator: AsyncIterableIterator<Bytes>, controller: AbortController);
    private decoder;
    [Symbol.asyncIterator](): AsyncIterator<T>;
    static fromResponse<T>(response: Response, controller: AbortController): JSONLDecoder<T>;
}
//# sourceMappingURL=jsonl.d.ts.map