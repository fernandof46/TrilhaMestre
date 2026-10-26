import React from 'react';
import { cn } from '@/lib/utils';

export default function TelemetryBar({ percent = 0, label = 'Telemetria de progresso', className }) {
  const value = Math.max(0, Math.min(100, percent));
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
        <span className="font-heading text-sm font-semibold text-petronas">{value}%</span>
      </div>
      <div className="telemetry-track relative mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-petronas-deep via-petronas to-petronas-soft transition-all duration-700 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}