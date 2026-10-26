import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ChoiceGroup from './ChoiceGroup';
import { GOAL_TYPES, LEVELS } from '@/lib/roadmapUtils';

const HOUR_OPTIONS = [
  { value: 4, label: '4 h' },
  { value: 8, label: '8 h' },
  { value: 12, label: '12 h' },
  { value: 20, label: '20 h' },
  { value: 30, label: '30 h+' },
];

const WEEK_OPTIONS = [
  { value: 4, label: '4 sem' },
  { value: 8, label: '8 sem' },
  { value: 12, label: '12 sem' },
  { value: 24, label: '24 sem' },
];

export default function GeneratorForm({ onGenerate, isGenerating, error }) {
  const [topic, setTopic] = useState('');
  const [goalType, setGoalType] = useState('aprender');
  const [level, setLevel] = useState('iniciante');
  const [hours, setHours] = useState(8);
  const [weeks, setWeeks] = useState(12);
  const [context, setContext] = useState('');
  const [touched, setTouched] = useState(false);

  const invalid = topic.trim().length < 3;

  const submit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (invalid) return;
    onGenerate({
      topic: topic.trim(),
      goalType,
      level,
      hoursPerWeek: hours,
      horizonWeeks: weeks,
      context: context.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-7">
      <div>
        <label
          htmlFor="topic"
          className="mb-2 block font-heading text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          O que você quer aprender ou construir?
        </label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ex.: tocar violão, ciência de dados, marcenaria, abrir um food truck..."
          className="h-12 border-border bg-background/60 text-base placeholder:text-muted-foreground/60 focus-visible:ring-petronas"
        />
        {touched && invalid ? (
          <p className="mt-2 text-xs text-race">Descreva seu objetivo com pelo menos 3 caracteres.</p>
        ) : null}
      </div>

      <ChoiceGroup label="Qual é a sua meta?" options={GOAL_TYPES} value={goalType} onChange={setGoalType} />

      <ChoiceGroup label="Seu nível hoje" options={LEVELS} value={level} onChange={setLevel} />

      <div className="grid gap-6 sm:grid-cols-2">
        <ChoiceGroup
          label="Horas por semana"
          variant="chips"
          options={HOUR_OPTIONS}
          value={hours}
          onChange={setHours}
        />
        <ChoiceGroup
          label="Prazo desejado"
          variant="chips"
          options={WEEK_OPTIONS}
          value={weeks}
          onChange={setWeeks}
        />
      </div>

      <div>
        <label
          htmlFor="context"
          className="mb-2 block font-heading text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          Contexto extra (opcional)
        </label>
        <Textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
          placeholder="Ex.: quero usar isso no meu trabalho, já sei o básico de Excel, tenho provas em 3 meses, prefiro aprender com vídeos..."
          className="border-border bg-background/60 placeholder:text-muted-foreground/60 focus-visible:ring-petronas"
        />
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-race/40 bg-race/10 px-3 py-2.5 text-sm text-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-race" />
          <span>{error}</span>
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isGenerating}
        className="group h-12 w-full bg-petronas font-heading text-sm uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-petronas-soft disabled:opacity-60"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando estratégia...
          </>
        ) : (
          <>
            Gerar meu roadmap
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}