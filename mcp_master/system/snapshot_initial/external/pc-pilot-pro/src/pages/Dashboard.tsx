import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import {
  Zap,
  Brain,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
} from "lucide-react";

const recentTasks = [
  { id: 1, name: "Email sorting automation", status: "completed", time: "2m ago" },
  { id: 2, name: "Screenshot OCR analysis", status: "running", time: "Just now" },
  { id: 3, name: "Data scraping pipeline", status: "completed", time: "15m ago" },
  { id: 4, name: "File organizer script", status: "failed", time: "1h ago" },
];

const statusColors: Record<string, string> = {
  completed: "text-primary bg-primary/10",
  running: "text-neon-blue bg-neon-blue/10 animate-pulse-glow",
  failed: "text-destructive bg-destructive/10",
};

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground"
        >
          Command Center
        </motion.h1>
        <p className="text-muted-foreground mt-1">Your AI automation overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Tasks Today" value="24" change="+12% from yesterday" positive />
        <StatCard icon={Brain} label="Active Models" value="3" />
        <StatCard icon={CheckCircle2} label="Success Rate" value="96%" change="+2%" positive />
        <StatCard icon={Clock} label="Avg. Runtime" value="1.8s" change="-0.3s" positive />
      </div>

      {/* Recent Tasks */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Recent Tasks</h2>
          <button className="text-sm text-primary flex items-center gap-1 hover:underline">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-border">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{task.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[task.status]}`}
                >
                  {task.status}
                </span>
                <span className="text-xs text-muted-foreground">{task.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "New Automation", desc: "Create a task from natural language", icon: Zap },
          { title: "Browse Skills", desc: "Install pre-built automations", icon: Brain },
          { title: "Configure Models", desc: "Set up LLM integrations", icon: CheckCircle2 },
        ].map((action, i) => (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5 text-left hover:glow-accent transition-shadow duration-300 group"
          >
            <action.icon className="w-6 h-6 text-accent mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-foreground">{action.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{action.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
