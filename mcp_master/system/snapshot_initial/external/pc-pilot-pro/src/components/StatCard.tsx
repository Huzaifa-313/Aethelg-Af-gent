import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

const StatCard = ({ icon: Icon, label, value, change, positive }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-xl p-5 hover:glow-primary transition-shadow duration-300"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    {change && (
      <span className={`text-xs mt-1 ${positive ? "text-primary" : "text-destructive"}`}>
        {change}
      </span>
    )}
  </motion.div>
);

export default StatCard;
