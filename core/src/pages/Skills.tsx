# AETHELGARD MERGED FILE
# Origin Repository: pc-pilot-pro-e51d5718dd1056cd53f1d84ba33b62f064da908e
# Original Path: src\pages\Skills.tsx
# Merge Date: 2026-05-07T19:25:59.512910
# ---

import { motion } from "framer-motion";
import { Search, Download, Star, Code2, Mail, Globe, Database, FileText, Image, Terminal } from "lucide-react";
import { useState } from "react";

const categories = ["All", "Productivity", "Dev Tools", "Data", "Media", "Browser"];

const skills = [
  { name: "Email Sorter", desc: "Auto-classify and organize inbox", icon: Mail, category: "Productivity", installs: "2.4k", rating: 4.8, installed: true },
  { name: "Web Scraper Pro", desc: "Extract data from any website", icon: Globe, category: "Browser", installs: "5.1k", rating: 4.9, installed: false },
  { name: "CSV Analyzer", desc: "Process and visualize CSV data", icon: Database, category: "Data", installs: "1.8k", rating: 4.5, installed: false },
  { name: "PDF Extractor", desc: "OCR and parse PDF documents", icon: FileText, category: "Productivity", installs: "3.2k", rating: 4.7, installed: true },
  { name: "Screenshot Analyzer", desc: "Visual AI for screen analysis", icon: Image, category: "Media", installs: "1.2k", rating: 4.6, installed: false },
  { name: "Shell Commander", desc: "Execute and chain shell scripts", icon: Terminal, category: "Dev Tools", installs: "4.0k", rating: 4.8, installed: false },
  { name: "Code Generator", desc: "Generate boilerplate code", icon: Code2, category: "Dev Tools", installs: "6.3k", rating: 4.9, installed: true },
  { name: "File Organizer", desc: "Smart file sorting by type/date", icon: FileText, category: "Productivity", installs: "2.9k", rating: 4.4, installed: false },
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = skills.filter(
    (s) =>
      (activeCategory === "All" || s.category === activeCategory) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Skills Marketplace</h1>
        <p className="text-muted-foreground mt-1">Install modular automations and extend your agent</p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="glass rounded-xl flex items-center gap-3 px-4 py-3 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 flex flex-col hover:glow-primary transition-shadow duration-300 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <skill.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="w-3 h-3 text-primary fill-primary" />
                {skill.rating}
              </div>
            </div>
            <h3 className="font-semibold text-foreground">{skill.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 flex-1">{skill.desc}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">
                <Download className="w-3 h-3 inline mr-1" />
                {skill.installs}
              </span>
              <button
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  skill.installed
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {skill.installed ? "Installed" : "Install"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
