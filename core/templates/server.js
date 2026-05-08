# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\server.js
# Merge Date: 2026-05-07T19:25:12.932465
# ---

import { createServer } from 'http';
import next from 'next';
import { attachCodeProxy } from 'thepopebot/code/ws-proxy';

const app = next({ dev: false });
const handle = app.getRequestHandler();

// HACK: Prevent Next.js from registering its own WebSocket upgrade handler.
// Without this, Next.js lazily calls setupWebSocketHandler() which uses its
// bundled http-proxy to write "HTTP/1.1 502 Bad Gateway" on already-upgraded
// sockets. No official API exists for this — see docs/HACKS.md.
app.didWebSocketSetup = true;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  attachCodeProxy(server);

  const port = process.env.PORT || 80;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
