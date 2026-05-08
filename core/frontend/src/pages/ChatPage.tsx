# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: frontend\src\pages\ChatPage.tsx
# Merge Date: 2026-05-07T19:12:07.585478
# ---

import { ChatArea } from '../components/Chat/ChatArea';
import { SystemPanel } from '../components/Chat/SystemPanel';
import { useAppStore } from '../lib/store';

export function ChatPage() {
  const systemPanelOpen = useAppStore((s) => s.systemPanelOpen);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 min-w-0">
        <ChatArea />
      </div>
      {systemPanelOpen && <SystemPanel />}
    </div>
  );
}
