import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Headphones,
  Target,
  Users,
  Video,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TYPE_ICON = {
  video: Video,
  curso: GraduationCap,
  doc: FileText,
  pratica: Wrench,
  livro: BookOpen,
  ferramenta: Wrench,
  comunidade: Users,
};

export default function StepRow({ step, done, onToggle, onOpenRadio }) {
  return (
    <div className={cn('border-t border-border/60 py-4 transition', done && 'opacity-75')}>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-label={done ? 'Desmarcar etapa' : 'Marcar etapa como concluída'}
          className="mt-0.5 shrink-0 transition hover:scale-110"
        >
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-petronas" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/70" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h4
              className={cn(
                'font-heading text-base font-semibold leading-snug tracking-tight',
                done && 'text-muted-foreground line-through decoration-petronas/50'
              )}
            >
              {step.title}
            </h4>
            {step.est_minutes ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {step.est_minutes} min
              </span>
            ) : null}
          </div>

          {step.description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          ) : null}

          {step.practice ? (
            <p className="mt-2.5 flex gap-2 text-sm text-foreground/90">
              <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-silver" />
              <span>
                <strong className="font-heading text-xs uppercase tracking-[0.16em] text-silver">Prática:</strong>{' '}
                {step.practice}
              </span>
            </p>
          ) : null}

          {step.success_criteria ? (
            <p className="mt-1.5 flex gap-2 text-sm text-foreground/80">
              <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-petronas" />
              <span>
                <strong className="font-heading text-xs uppercase tracking-[0.16em] text-petronas">Pronto quando:</strong>{' '}
                {step.success_criteria}
              </span>
            </p>
          ) : null}

          {(step.resources || []).length > 0 ? (
            <ul className="mt-3.5 flex flex-wrap gap-2">
              {step.resources.map((resource, index) => {
                const Icon = TYPE_ICON[(resource.type || '').toLowerCase()] || FileText;
                return (
                  <li key={`${resource.url}-${index}`} className="max-w-full">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-xs transition hover:border-petronas/50 hover:bg-petronas/8"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-petronas" />
                      <span className="truncate font-medium text-foreground/90">{resource.title}</span>
                      {resource.provider ? (
                        <span className="hidden shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:inline">
                          {resource.provider}
                        </span>
                      ) : null}
                      <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground transition group-hover/link:text-petronas" />
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onOpenRadio}
            className="mt-3 h-8 px-2 font-heading text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:bg-petronas/10 hover:text-petronas"
          >
            <Headphones className="mr-1.5 h-3.5 w-3.5" />
            Rádio do engenheiro
          </Button>
        </div>
      </div>
    </div>
  );
}