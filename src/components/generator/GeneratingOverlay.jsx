import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

const STAGES = [
  'Lendo o briefing da sua corrida...',
  'Traçando a estratégia etapa por etapa...',
  'Buscando materiais gratuitos de verdade na web...',
  'Montando módulos, práticas e checkpoints...',
];

export default function GeneratingOverlay({ topic }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStage((current) => (current + 1) % STAGES.length), 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/93 backdrop-blur-sm">
      <div className="w-full max-w-md px-6 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-petronas/12 ring-1 ring-petronas/40">
          <Activity className="h-6 w-6 animate-blip text-petronas" />
        </div>
        <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
          Pit wall · gerando estratégia
        </p>
        <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight">{topic}</h3>
        <p className="mt-2 text-sm text-petronas">{STAGES[stage]}</p>
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/3 animate-sweep rounded-full bg-gradient-to-r from-transparent via-petronas to-transparent" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Isso leva de 20 a 60 segundos. Não feche esta tela.
        </p>
      </div>
    </div>
  );
}