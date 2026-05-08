# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\layout.js
# Merge Date: 2026-05-07T19:25:13.143464
# ---

import './globals.css';
import { ThemeProvider } from './components/theme-provider';

export const metadata = {
  title: 'thepopebot',
  description: 'AI Agent',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
