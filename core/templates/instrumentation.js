# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\instrumentation.js
# Merge Date: 2026-05-07T19:25:12.871468
# ---

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { register } = await import('thepopebot/instrumentation');
    await register();
  }
}
