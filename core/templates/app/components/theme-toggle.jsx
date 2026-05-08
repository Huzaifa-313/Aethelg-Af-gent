# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\components\theme-toggle.jsx
# Merge Date: 2026-05-07T19:25:13.370465
# ---

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-[34px] w-[106px]" />;

  const options = [
    { value: 'light', label: '☀️' },
    { value: 'dark', label: '🌙' },
    { value: 'system', label: '💻' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-muted p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`rounded px-2 py-1 text-sm transition-colors ${
            theme === opt.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title={opt.value.charAt(0).toUpperCase() + opt.value.slice(1)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
