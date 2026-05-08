import { useState } from "react";
import { motion } from "framer-motion";
import { Key, Brain, Monitor, Shield, Save, Eye, EyeOff, Check } from "lucide-react";

interface APIConfig {
  label: string;
  key: string;
  placeholder: string;
  connected: boolean;
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("models");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const [apiConfigs] = useState<APIConfig[]>([
    { label: "OpenAI (GPT-5)", key: "", placeholder: "sk-...", connected: false },
    { label: "Anthropic (Claude)", key: "", placeholder: "sk-ant-...", connected: false },
    { label: "Perplexity", key: "", placeholder: "pplx-...", connected: false },
    { label: "Ollama (Local)", key: "http://localhost:11434", placeholder: "http://localhost:11434", connected: true },
    { label: "Replicate", key: "", placeholder: "r8_...", connected: false },
    { label: "Grok", key: "", placeholder: "xai-...", connected: false },
  ]);

  const tabs = [
    { id: "models", label: "LLM Models", icon: Brain },
    { id: "system", label: "System", icon: Monitor },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your AI agent and integrations</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <div className="flex lg:flex-col gap-2 lg:w-48 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === "models" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-5">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  API Keys & Model Configuration
                </h2>
                <p className="text-sm text-muted-foreground">
                  Configure your preferred LLM providers. Keys are encrypted and stored securely.
                </p>

                <div className="space-y-4">
                  {apiConfigs.map((config) => (
                    <div key={config.label} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">{config.label}</label>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            config.connected
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {config.connected ? "Connected" : "Not configured"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showKeys[config.label] ? "text" : "password"}
                            placeholder={config.placeholder}
                            defaultValue={config.key}
                            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 font-mono"
                          />
                          <button
                            onClick={() => setShowKeys((p) => ({ ...p, [config.label]: !p[config.label] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showKeys[config.label] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Default model selector */}
              <div className="glass rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-foreground">Default Model</h3>
                <select className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50">
                  <option>Auto (best available)</option>
                  <option>GPT-5 (OpenAI)</option>
                  <option>Claude 3.5 Sonnet (Anthropic)</option>
                  <option>Llama 3 70B (Ollama Local)</option>
                  <option>Grok (xAI)</option>
                </select>
              </div>
            </motion.div>
          )}

          {activeTab === "system" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">System Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Script Output Directory</label>
                  <input
                    defaultValue="~/AIAutoPilot/scripts"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Python Path</label>
                  <input
                    defaultValue="/usr/bin/python3"
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground font-mono outline-none focus:border-primary/50"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">Script Sandboxing</span>
                    <p className="text-xs text-muted-foreground">Preview scripts before execution</p>
                  </div>
                  <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-primary-foreground rounded-full absolute right-1 top-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">Rate Limiting</span>
                    <p className="text-xs text-muted-foreground">Limit API calls per minute</p>
                  </div>
                  <input
                    defaultValue="60"
                    className="w-20 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground text-center outline-none focus:border-primary/50"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">Max Upload Size</span>
                    <p className="text-xs text-muted-foreground">Maximum file size for uploads</p>
                  </div>
                  <span className="text-sm text-muted-foreground">20 MB</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
