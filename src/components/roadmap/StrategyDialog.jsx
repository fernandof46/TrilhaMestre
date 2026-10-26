import React, { useState } from 'react';
import { AlertTriangle, Loader2, SlidersHorizontal, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { adaptRoadmap } from '@/lib/roadmapAi';
import { remapCompleted } from '@/lib/roadmapUtils';

const SHORTCUTS = [
  'Está difícil demais, preciso de etapas menores',
  'Está fácil demais, quero avançar mais rápido',
  'Tenho menos tempo por semana agora',
  'Quero focar em prática e projeto, menos teoria',
  'Preciso priorizar só o que gera resultado rápido',
];

export default function StrategyDialog({ open, onOpenChange, roadmap, onAdapted }) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const apply = async () => {
    setLoading(true);
    setError('');
    setNote('');
    try {
      const revised = await adaptRoadmap({ roadmap, feedback: feedback.trim() });
      const modules = revised.modules || [];
      const completed = remapCompleted(roadmap.modules || [], roadmap.completed_steps || [], modules);
      const adaptations = [
        ...(roadmap.adaptations || []),
        { date: new Date().toISOString(), note: revised.adaptation_note || feedback.trim() || 'Ajuste de estratégia' },
      ].slice(-12);

      const patch = {
        modules,
        completed_steps: completed,
        summary: revised.summary || roadmap.summary,
        total_weeks: revised.total_weeks || roadmap.total_weeks,
        total_hours: revised.total_hours || roadmap.total_hours,
        adaptations,
      };

      await base44.entities.Roadmap.update(roadmap.id, patch);
      onAdapted?.({ ...roadmap, ...patch });
      setNote(revised.adaptation_note || 'Estratégia atualizada com sucesso.');
      setFeedback('');
    } catch (e) {
      setError('Não conseguimos ajustar o roadmap agora. Tente novamente em alguns segundos.');
    } finally {
      setLoading(false);
    }
  };

  const history = (roadmap.adaptations || []).slice(-2).reverse();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading uppercase tracking-[0.16em]">
            <SlidersHorizontal className="h-4 w-4 text-petronas" />
            Ajuste de estratégia
          </DialogTitle>
          <DialogDescription>
            Diga o que mudou no seu ritmo ou nas suas dificuldades. A IA reescreve o plano mantendo o objetivo e
            preservando o que você já concluiu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {SHORTCUTS.map((shortcut) => (
              <button
                key={shortcut}
                type="button"
                onClick={() => setFeedback(shortcut)}
                className="rounded-full border border-border px-3 py-1.5 text-left text-[11px] text-muted-foreground transition hover:border-petronas/50 hover:text-foreground"
              >
                {shortcut}
              </button>
            ))}
          </div>

          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            placeholder="Ex.: travei na parte de estatística, tenho só 4h por semana agora e quero um projeto no fim."
            className="border-border bg-background/60 focus-visible:ring-petronas"
          />

          {error ? (
            <p className="flex items-start gap-2 text-sm text-race">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : null}

          {note ? (
            <div className="rounded-lg border border-petronas/40 bg-petronas/10 px-3 py-2.5 text-sm leading-relaxed">
              <p className="font-heading text-[10px] uppercase tracking-[0.28em] text-petronas">Nova estratégia</p>
              <p className="mt-1.5 text-foreground/90">{note}</p>
            </div>
          ) : null}

          {history.length > 0 ? (
            <div className="space-y-1.5">
              <p className="font-heading text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Ajustes anteriores
              </p>
              {history.map((item, index) => (
                <p key={`${item.date}-${index}`} className="text-xs leading-relaxed text-muted-foreground">
                  · {item.note}
                </p>
              ))}
            </div>
          ) : null}

          <Button
            type="button"
            onClick={apply}
            disabled={loading}
            className="h-10 w-full bg-petronas font-heading text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-petronas-soft disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reescrevendo o plano...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Aplicar ajuste
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}