# AETHELGARD MERGED FILE
# Origin Repository: claude-code-info
# Original Path: app\icon.tsx
# Merge Date: 2026-05-07T19:14:26.899460
# ---

import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          background: "#000000",
          color: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        }}
      >
        C
      </div>
    ),
    {
      ...size,
    },
  );
}
