import React from 'react';
import { CheckCircle2, RefreshCw, Trophy, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuizResult({ result, questions, answers, onRetry }) {
  const passed = result.passed;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background/50 p-4 text-center">
        <Trophy className="mx-auto h-5 w-5 text-petronas" />
        <p className="mt-2 font-heading text-4xl font-bold leading-none text-foreground">{result.percent}%</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {result.score} de {result.total} corretas
        </p>
        <p className={passed ? 'mt-2 text-sm text-petronas' : 'mt-2 text-sm text-race'}>
          {passed
            ? 'Checkpoint aprovado — você pode seguir para o próximo setor.'
            : 'Ainda não foi dessa vez. Revise as explicações abaixo e peça ajuda no rádio do engenheiro.'}
        </p>
      </div>

      <div className="max-h-[38vh] space-y-3 overflow-y-auto pr-1">
        {questions.map((question, index) => {
          const correct = answers[index] === question.correct_index;
          return (
            <div key={index} className="rounded-lg border border-border bg-card/60 p-3">
              <div className="flex gap-2">
                {correct ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-petronas" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-race" />
                )}
                <p className="text-sm font-medium leading-snug">{question.question}</p>
              </div>
              {!correct ? (
                <p className="mt-2 text-xs text-foreground/90">
                  <strong className="font-heading uppercase tracking-[0.14em] text-petronas">Correta: </strong>
                  {question.options[question.correct_index]}
                </p>
              ) : null}
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{question.explanation}</p>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        onClick={onRetry}
        variant="outline"
        className="h-10 w-full border-border font-heading text-[11px] uppercase tracking-[0.2em] hover:border-petronas/50 hover:text-petronas"
      >
        <RefreshCw className="mr-2 h-3.5 w-3.5" />
        Nova bateria de perguntas
      </Button>
    </div>
  );
}