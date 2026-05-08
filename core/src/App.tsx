# AETHELGARD MERGED FILE
# Origin Repository: pc-pilot-pro-e51d5718dd1056cd53f1d84ba33b62f064da908e
# Original Path: src\App.tsx
# Merge Date: 2026-05-07T19:25:57.764912
# ---

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppSidebar from "./components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import TaskHistory from "./pages/TaskHistory";
import Skills from "./pages/Skills";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen">
    <AppSidebar />
    <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">{children}</main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/chat" element={<AppLayout><Chat /></AppLayout>} />
          <Route path="/tasks" element={<AppLayout><TaskHistory /></AppLayout>} />
          <Route path="/skills" element={<AppLayout><Skills /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
