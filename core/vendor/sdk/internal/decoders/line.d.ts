# AETHELGARD MERGED FILE
# Origin Repository: claude-code5
# Original Path: vendor\sdk\internal\decoders\line.d.ts
# Merge Date: 2026-05-07T19:17:48.008125
# ---

                              
export type Bytes = string | ArrayBuffer | Uint8Array | Buffer | null | undefined;
/**
 * A re-implementation of httpx's `LineDecoder` in Python that handles incrementally
 * reading lines from text.
 *
 * https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258
 */
export declare class LineDecoder {
    #private;
    static NEWLINE_CHARS: Set<string>;
    static NEWLINE_REGEXP: RegExp;
    buffer: Uint8Array;
    textDecoder: any;
    constructor();
    decode(chunk: Bytes): string[];
    decodeText(bytes: Bytes): string;
    flush(): string[];
}
//# sourceMappingURL=line.d.ts.map