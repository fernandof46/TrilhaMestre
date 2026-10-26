import React, { useState } from 'react';
import { ChevronDown, Gauge, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StepRow from './StepRow';
import { cn } from '@/lib/utils';
import { moduleProgress } from '@/lib/roadmapUtils';

export default function ModuleCard({
  module,
  index,
  completedSteps,
  onToggleStep,
  onOpenRadio,
  onOpenQuiz,
  lastAttempt,
}) {
  const [open, setOpen] = useState(index === 0);
  const progress = moduleProgress(module, completedSteps);
  const steps = module.steps || [];

  return (
    <section className="animate-rise overflow-hidden rounded-xl border border-border bg-card/60 shadow-panel backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-accent/40 sm:px-6"
      >
        <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-petronas">
          Módulo {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-heading text-lg font-semibold tracking-tight">{module.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {progress.done}/{progress.total} etapas · {module.est_hours ? `${module.est_hours} h estimadas` : 'carga flexível'}
          </p>
        </div>
        <div className="hidden w-32 items-center gap-2 sm:flex">
          <div className="telemetry-track h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-petronas transition-all duration-700"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="font-heading text-xs text-muted-foreground">{progress.percent}%</span>
        </div>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <div className="px-4 pb-5 sm:px-6">
          {module.objective ? (
            <p className="border-l-2 border-petronas/50 pl-3 text-sm leading-relaxed text-muted-foreground">
              {module.objective}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="sm"
              onClick={onOpenQuiz}
              className="h-8 bg-petronas/12 px-3 font-heading text-[10px] uppercase tracking-[0.2em] text-petronas ring-1 ring-petronas/40 hover:bg-petronas/20"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              Checkpoint de setor
            </Button>
            {lastAttempt ? (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 font-heading text-[11px] uppercase tracking-[0.16em]',
                  lastAttempt.passed ? 'text-petronas' : 'text-race'
                )}
              >
                <Gauge className="h-3.5 w-3.5" />
                Último resultado: {lastAttempt.score}/{lastAttempt.total} ({lastAttempt.percent}%)
              </span>
            ) : null}
          </div>

          <div className="mt-2">
            {steps.map((step) => (
              <StepRow
                key={step.key}
                step={step}
                done={completedSteps.includes(step.key)}
                onToggle={() => onToggleStep(step.key)}
                onOpenRadio={() => onOpenRadio(module, step)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}