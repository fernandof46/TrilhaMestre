import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { generateQuiz } from '@/lib/roadmapAi';
import QuizResult from './QuizResult';
import { cn } from '@/lib/utils';

export default function SectorQuiz({ open, onOpenChange, roadmap, module, moduleIndex, onSaved }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const start = async () => {
    setLoading(true);
    setError('');
    setAnswers({});
    setResult(null);
    try {
      const generated = await generateQuiz({ roadmap, module });
      setQuestions(generated);
    } catch (e) {
      setError('Não conseguimos gerar o checkpoint agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && module) {
      setQuestions([]);
      start();
    }
  }, [open, moduleIndex]);

  const answeredCount = Object.keys(answers).length;

  const submit = async () => {
    if (answeredCount < questions.length) {
      setError('Responda todas as perguntas antes de corrigir.');
      return;
    }
    setError('');
    setSaving(true);
    const total = questions.length;
    const score = questions.reduce((acc, question, index) => acc + (answers[index] === question.correct_index ? 1 : 0), 0);
    const percent = Math.round((score / total) * 100);
    const passed = percent >= 70;
    try {
      await base44.entities.QuizAttempt.create({
        roadmap_id: roadmap.id,
        roadmap_title: roadmap.title,
        module_index: moduleIndex,
        module_title: module.title,
        questions,
        answers: questions.map((_, index) => (answers[index] ?? -1)),
        score,
        total,
        percent,
        passed,
      });
      setResult({ score, total, percent, passed });
      onSaved?.({ module_index: moduleIndex, score, total, percent, passed });
    } catch (e) {
      setError('Não conseguimos salvar seu resultado. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading uppercase tracking-[0.16em]">
            <ShieldCheck className="h-4 w-4 text-petronas" />
            Checkpoint de setor
          </DialogTitle>
          <DialogDescription>
            {module?.title} · prove o domínio deste módulo antes de acelerar para o próximo.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-petronas" />
            Preparando as perguntas do seu nível...
          </div>
        ) : null}

        {error ? (
          <p className="flex items-start gap-2 text-sm text-race">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        ) : null}

        {result ? (
          <QuizResult
            result={result}
            questions={questions}
            answers={questions.map((_, index) => answers[index])}
            onRetry={start}
          />
        ) : null}

        {!result && !loading && questions.length > 0 ? (
          <>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="rounded-lg border border-border bg-background/40 p-3.5">
                  <p className="font-heading text-[10px] uppercase tracking-[0.24em] text-petronas">
                    Pergunta {index + 1}
                  </p>
                  <p className="mt-1.5 text-sm font-medium leading-snug">{question.question}</p>
                  <div className="mt-3 space-y-1.5">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))}
                        className={cn(
                          'flex w-full items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition',
                          answers[index] === optionIndex
                            ? 'border-petronas bg-petronas/10 text-foreground'
                            : 'border-border bg-card/40 text-muted-foreground hover:border-silver/40 hover:text-foreground'
                        )}
                      >
                        <span className="font-heading text-[11px] uppercase tracking-[0.16em]">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="flex-1">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={submit}
              disabled={saving}
              className="h-10 w-full bg-petronas font-heading text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-petronas-soft disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando resultado...
                </>
              ) : (
                `Corrigir (${answeredCount}/${questions.length} respondidas)`
              )}
            </Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}