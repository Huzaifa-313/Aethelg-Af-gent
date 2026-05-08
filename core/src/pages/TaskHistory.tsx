# AETHELGARD MERGED FILE
# Origin Repository: pc-pilot-pro-e51d5718dd1056cd53f1d84ba33b62f064da908e
# Original Path: src\pages\TaskHistory.tsx
# Merge Date: 2026-05-07T19:25:59.537911
# ---

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Clock, Download, RotateCcw, Search } from "lucide-react";
import { useState } from "react";

const tasks = [
  { id: 1, name: "Email sorting automation", status: "completed", model: "Claude 3.5", runtime: "2.3s", date: "2026-03-08 14:22", output: "sort_emails.py" },
  { id: 2, name: "Screenshot OCR analysis", status: "completed", model: "GPT-5", runtime: "1.1s", date: "2026-03-08 14:18", output: "ocr_result.json" },
  { id: 3, name: "Browser form fill automation", status: "running", model: "Llama 3 (Local)", runtime: "—", date: "2026-03-08 14:15", output: "" },
  { id: 4, name: "CSV data processing pipeline", status: "failed", model: "Claude 3.5", runtime: "5.2s", date: "2026-03-08 13:50", output: "" },
  { id: 5, name: "Desktop file organizer", status: "completed", model: "GPT-5", runtime: "3.7s", date: "2026-03-08 12:30", output: "organizer.py" },
  { id: 6, name: "Web scraping — product prices", status: "completed", model: "Llama 3 (Local)", runtime: "8.1s", date: "2026-03-08 11:05", output: "scraper.py" },
];

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="w-4 h-4 text-primary" />,
  running: <Loader2 className="w-4 h-4 text-neon-blue animate-spin" />,
  failed: <XCircle className="w-4 h-4 text-destructive" />,
};

const TaskHistory = () => {
  const [search, setSearch] = useState("");
  const filtered = tasks.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task History</h1>
          <p className="text-muted-foreground mt-1">All automated tasks and their outputs</p>
        </div>
      </div>

      {/* Search */}
      <div className="glass rounded-xl flex items-center gap-3 px-4 py-3">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Task</th>
                <th className="text-left px-5 py-3 font-medium">Model</th>
                <th className="text-left px-5 py-3 font-medium">Runtime</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((task, i) => (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-5 py-3.5">{statusIcons[task.status]}</td>
                  <td className="px-5 py-3.5 font-medium text-foreground">{task.name}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                      {task.model}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.runtime}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{task.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {task.output && (
                        <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Retry">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskHistory;
