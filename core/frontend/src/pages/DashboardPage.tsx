# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: frontend\src\pages\DashboardPage.tsx
# Merge Date: 2026-05-07T19:12:07.598461
# ---

import { BarChart3 } from 'lucide-react';
import { EnergyDashboard } from '../components/Dashboard/EnergyDashboard';
import { CostComparison } from '../components/Dashboard/CostComparison';
import { TraceDebugger } from '../components/Dashboard/TraceDebugger';

export function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 size={24} style={{ color: 'var(--color-accent)' }} />
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <EnergyDashboard />
          <CostComparison />
        </div>

        <TraceDebugger />
      </div>
    </div>
  );
}
