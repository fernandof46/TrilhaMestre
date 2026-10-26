import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Gauge, Layers, Printer, SlidersHorizontal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TelemetryBar from './TelemetryBar';
import StrategyDialog from './StrategyDialog';
import { STATUSES, goalLabel, levelLabel, modulesHours, progressOf, statusLabel } from '@/lib/roadmapUtils';
import { cn } from '@/lib/utils';

export default function RoadmapHero({ roadmap, onAdapted, onStatusChange }) {
  const [strategyOpen, setStrategyOpen] = useState(false);
  const progress = progressOf(roadmap);
  const hours = roadmap.total_hours || modulesHours(roadmap.modules);

  const stats = [
    { icon: Gauge, label: 'Etapas', value: `${progress.done}/${progress.total}` },
    { icon: Clock, label: 'Carga total', value: `${Math.round(hours)} h` },
    { icon: Layers, label: 'Módulos', value: `${(roadmap.modules || []).length}` },
    { icon: Zap, label: 'Ritmo', value: `${roadmap.hours_per_week || 8} h/sem` },
  ];

  return (
    <section className="rounded-2xl border border-border bg-card/70 p-5 shadow-panel backdrop-blur sm:p-7">
      <p className="font-heading text-[10px] uppercase tracking-[0.35em] text-petronas">{roadmap.topic}</p>
      <h1 className="mt-3 font-heading text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
        {roadmap.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border px-2.5 py-1 font-heading text-[10px] uppercase tracking-[0.18em] text-silver">
          {levelLabel(roadmap.level)}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 font-heading text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {goalLabel(roadmap.goal_type)}
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 font-heading text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {roadmap.total_weeks || roadmap.horizon_weeks || '—'} semanas
        </span>
      </div>

      {roadmap.summary ? (
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{roadmap.summary}</p>
      ) : null}

      <TelemetryBar percent={progress.percent} className="mt-6" />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-lg border border-border/70 bg-background/40 px-3 py-2.5">
            <Icon className="h-3.5 w-3.5 text-petronas" />
            <p className="mt-1.5 font-heading text-lg font-semibold leading-none">{value}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {roadmap.strategy ? (
        <div className="cockpit-panel mt-6 border border-border/70 bg-background/40 px-4 py-4">
          <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-silver">Plano de corrida</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{roadmap.strategy}</p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => setStrategyOpen(true)}
          className="h-10 bg-petronas font-heading text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-petronas-soft"
        >
          <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
          Ajustar estratégia com IA
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 border-border bg-transparent font-heading text-[11px] uppercase tracking-[0.2em] hover:border-petronas/50 hover:text-petronas"
        >
          <Link to={`/print/${roadmap.id}`}>
            <Printer className="mr-2 h-3.5 w-3.5" />
            Imprimir / PDF
          </Link>
        </Button>
        <div className="ml-auto flex items-center gap-1 rounded-full border border-border p-1">
          {STATUSES.map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => onStatusChange(status.value)}
              className={cn(
                'rounded-full px-3 py-1.5 font-heading text-[10px] uppercase tracking-[0.16em] transition',
                roadmap.status === status.value
                  ? 'bg-petronas/15 text-petronas ring-1 ring-petronas/40'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {statusLabel(status.value)}
            </button>
          ))}
        </div>
      </div>

      <StrategyDialog open={strategyOpen} onOpenChange={setStrategyOpen} roadmap={roadmap} onAdapted={onAdapted} />
    </section>
  );
}