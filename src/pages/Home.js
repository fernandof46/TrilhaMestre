import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, Route, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import GeneratorForm from '@/components/generator/GeneratorForm';
import GeneratingOverlay from '@/components/generator/GeneratingOverlay';
import { generateRoadmap } from '@/lib/roadmapAi';
import { rememberRoadmap } from '@/lib/roadmapUtils';

const HIGHLIGHTS = [
  {
    icon: Route,
    title: 'Caminho exato',
    text: 'Módulos e etapas na ordem certa para o seu nível, com o tempo de cada uma.',
  },
  {
    icon: Sparkles,
    title: 'Materiais gratuitos',
    text: 'Vídeos, cursos e documentação gratuita de verdade, verificados na web.',
  },
  {
    icon: Headphones,
    title: 'IA a bordo',
    text: 'Tutor por etapa, checkpoints de validação e roadmap que se ajusta ao seu ritmo.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pendingTopic, setPendingTopic] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async (input) => {
    setIsGenerating(true);
    setError('');
    setPendingTopic(input.topic);
    try {
      const draft = await generateRoadmap(input);
      const record = await base44.entities.Roadmap.create({
        title: draft.title || input.topic,
        topic: input.topic,
        goal_type: input.goalType,
        level: input.level,
        hours_per_week: input.hoursPerWeek,
        horizon_weeks: input.horizonWeeks,
        context: input.context,
        summary: draft.summary || '',
        strategy: draft.strategy || '',
        total_weeks: draft.total_weeks || input.horizonWeeks,
        total_hours: draft.total_hours || 0,
        modules: draft.modules || [],
        completed_steps: [],
        status: 'em_andamento',
      });
      rememberRoadmap(record.id);
      base44.analytics.track({
        eventName: 'roadmap_generated',
        properties: { level: input.level, goal_type: input.goalType, weeks: input.horizonWeeks },
      });
      navigate(`/roadmap/${record.id}`);
    } catch (e) {
      setError('Não conseguimos montar o roadmap agora. Tente novamente em alguns segundos.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-10">
      {isGenerating ? <GeneratingOverlay topic={pendingTopic} /> : null}

      <section className="relative">
        <div className="chequer absolute right-0 top-0 hidden h-16 w-28 rounded-lg opacity-10 sm:block" />
        <p className="font-heading text-[10px] uppercase tracking-[0.45em] text-petronas">Cockpit de estudos</p>
        <h1 className="mt-4 font-heading text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-6xl">
          Seu caminho exato
          <br />
          <span className="text-petronas">até o objetivo</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Diga o que você quer aprender ou construir, qual é o seu nível e quanto tempo tem por semana. A IA monta o
          roadmap completo — etapas, práticas, critérios de sucesso e links de materiais gratuitos — e ajusta a
          estratégia conforme você avança.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="cockpit-panel border border-border/70 bg-card/50 px-4 py-4 backdrop-blur-sm transition hover:border-petronas/40"
            >
              <Icon className="h-4 w-4 text-petronas" />
              <h2 className="mt-3 font-heading text-sm font-semibold uppercase tracking-[0.14em]">{title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/70 p-5 shadow-panel backdrop-blur sm:p-8">
        <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} error={error} />
      </section>
    </div>
  );
}