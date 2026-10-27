import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, Loader2, Printer } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { goalLabel, levelLabel, modulesHours, progressOf, withStepKeys } from '@/lib/roadmapUtils';

export default function PrintRoadmap() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const record = await base44.entities.Roadmap.get(id);
        if (active) setRoadmap({ ...record, modules: withStepKeys(record.modules || []) });
      } catch (e) {
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-petronas" />
        Preparando o documento...
      </div>
    );
  }

  if (notFound || !roadmap) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
        <p className="font-heading text-lg uppercase tracking-[0.16em] text-foreground">Roadmap não encontrado</p>
        <Link to="/history" className="font-heading text-[11px] uppercase tracking-[0.2em] text-petronas">
          Voltar para a garagem
        </Link>
      </div>
    );
  }

  const progress = progressOf(roadmap);
  const hours = roadmap.total_hours || modulesHours(roadmap.modules);

  return (
    <div className="min-h-screen bg-background carbon-weave py-8">
      <div className="no-print mx-auto mb-5 flex max-w-[840px] flex-wrap items-center justify-between gap-3 px-4">
        <Button
          asChild
          variant="ghost"
          className="font-heading text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          <Link to={`/roadmap/${roadmap.id}`}>
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
            Voltar ao cockpit
          </Link>
        </Button>
        <Button
          onClick={() => window.print()}
          className="h-10 bg-petronas font-heading text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-petronas-soft"
        >
          <Printer className="mr-2 h-3.5 w-3.5" />
          Imprimir / Salvar em PDF
        </Button>
      </div>

      <article className="print-sheet mx-auto max-w-[840px] bg-paper px-8 py-10 text-paper-ink shadow-2xl sm:px-12">
        <header className="border-b-2 border-paper-ink/80 pb-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-[10px] uppercase tracking-[0.42em] text-paper-muted">
                AMG Roadmap · Study Performance
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold uppercase leading-tight">{roadmap.title}</h1>
              <p className="mt-1.5 text-sm text-paper-muted">{roadmap.topic}</p>
            </div>
            <div className="hidden h-14 w-14 items-center justify-center border-2 border-paper-ink font-heading text-lg font-bold sm:flex">
              {progress.percent}%
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
            <p>
              <span className="block uppercase tracking-[0.2em] text-paper-muted">Nível</span>
              <strong className="font-heading text-sm">{levelLabel(roadmap.level)}</strong>
            </p>
            <p>
              <span className="block uppercase tracking-[0.2em] text-paper-muted">Objetivo</span>
              <strong className="font-heading text-sm">{goalLabel(roadmap.goal_type)}</strong>
            </p>
            <p>
              <span className="block uppercase tracking-[0.2em] text-paper-muted">Carga total</span>
              <strong className="font-heading text-sm">
                {Math.round(hours)} h · {roadmap.total_weeks || roadmap.horizon_weeks || '—'} semanas
              </strong>
            </p>
            <p>
              <span className="block uppercase tracking-[0.2em] text-paper-muted">Emitido em</span>
              <strong className="font-heading text-sm">
                {format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}
              </strong>
            </p>
          </div>
        </header>

        {roadmap.summary ? <p className="mt-6 text-sm leading-relaxed">{roadmap.summary}</p> : null}

        {roadmap.strategy ? (
          <div className="print-avoid-break mt-5 border-l-2 border-paper-ink/70 pl-4">
            <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-paper-muted">Plano de corrida</p>
            <p className="mt-1.5 text-sm leading-relaxed">{roadmap.strategy}</p>
          </div>
        ) : null}

        <div className="mt-8 space-y-7">
          {(roadmap.modules || []).map((module, moduleIndex) => (
            <section key={`${module.title}-${moduleIndex}`} className="print-avoid-break">
              <h2 className="border-b border-paper-line pb-2 font-heading text-lg font-bold uppercase tracking-tight">
                Módulo {String(moduleIndex + 1).padStart(2, '0')} — {module.title}
              </h2>
              {module.objective ? (
                <p className="mt-2 text-sm italic leading-relaxed text-paper-muted">{module.objective}</p>
              ) : null}
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-paper-muted">
                {module.est_hours ? `${module.est_hours} h estimadas` : 'carga flexível'} ·{' '}
                {(module.steps || []).length} etapas
              </p>

              <ol className="mt-4 space-y-4">
                {(module.steps || []).map((step) => {
                  const done = (roadmap.completed_steps || []).includes(step.key);
                  return (
                    <li key={step.key} className="print-avoid-break flex gap-3">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-paper-ink text-[10px] leading-none">
                        {done ? '✓' : ''}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading text-sm font-semibold">
                          {step.title}
                          {step.est_minutes ? (
                            <span className="ml-2 font-body text-[11px] font-normal uppercase tracking-[0.16em] text-paper-muted">
                              {step.est_minutes} min
                            </span>
                          ) : null}
                        </p>
                        {step.description ? (
                          <p className="mt-1 text-sm leading-relaxed">{step.description}</p>
                        ) : null}
                        {step.practice ? (
                          <p className="mt-1.5 text-sm leading-relaxed">
                            <strong className="font-heading uppercase tracking-[0.14em]">Prática:</strong>{' '}
                            {step.practice}
                          </p>
                        ) : null}
                        {step.success_criteria ? (
                          <p className="mt-1 text-sm leading-relaxed">
                            <strong className="font-heading uppercase tracking-[0.14em]">Pronto quando:</strong>{' '}
                            {step.success_criteria}
                          </p>
                        ) : null}
                        {(step.resources || []).length > 0 ? (
                          <ul className="mt-2 space-y-1">
                            {(step.resources || []).map((resource, resourceIndex) => (
                              <li key={`${resource.url}-${resourceIndex}`} className="text-xs leading-relaxed">
                                <span className="uppercase tracking-[0.14em] text-paper-muted">
                                  {resource.type || 'material'}
                                </span>{' '}
                                — {resource.title} ({resource.provider || 'gratuito'})
                                <br />
                                <span className="break-all">{resource.url}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>

        <footer className="mt-10 border-t border-paper-line pt-4 text-[11px] leading-relaxed text-paper-muted">
          Progresso atual: {progress.done} de {progress.total} etapas concluídas ({progress.percent}%). Documento gerado
          pelo AMG Roadmap com materiais gratuitos e progresso salvo no app.
        </footer>
      </article>
    </div>
  );
}