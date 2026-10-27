import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Trophy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import RoadmapHero from '@/components/roadmap/RoadmapHero';
import ModuleCard from '@/components/roadmap/ModuleCard';
import EngineerRadio from '@/components/roadmap/EngineerRadio';
import SectorQuiz from '@/components/roadmap/SectorQuiz';
import { progressOf, withStepKeys } from '@/lib/roadmapUtils';

export default function RoadmapDetail() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [radio, setRadio] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const record = await base44.entities.Roadmap.get(id);
        if (!active) return;
        setRoadmap({ ...record, modules: withStepKeys(record.modules || []) });
        const page = await base44.entities.QuizAttempt.filter(
          { roadmap_id: id },
          { sort: '-created_date', limit: 50 }
        );
        if (active) setAttempts(page.items || []);
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

  const toggleStep = async (key) => {
    const current = roadmap.completed_steps || [];
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    setRoadmap({ ...roadmap, completed_steps: next });
    await base44.entities.Roadmap.update(roadmap.id, { completed_steps: next });
  };

  const changeStatus = async (status) => {
    setRoadmap({ ...roadmap, status });
    await base44.entities.Roadmap.update(roadmap.id, { status });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-petronas" />
        Carregando o cockpit...
      </div>
    );
  }

  if (notFound || !roadmap) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-8 text-center">
        <p className="font-heading text-lg uppercase tracking-[0.16em]">Roadmap não encontrado</p>
        <p className="mt-2 text-sm text-muted-foreground">Ele pode ter sido removido da garagem.</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 font-heading text-[11px] uppercase tracking-[0.2em] text-petronas"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Criar um novo roadmap
        </Link>
      </div>
    );
  }

  const progress = progressOf(roadmap);
  const lastAttemptByModule = {};
  attempts.forEach((attempt) => {
    const key = attempt.module_index;
    if (!lastAttemptByModule[key]) lastAttemptByModule[key] = attempt;
  });

  return (
    <div className="space-y-5">
      <RoadmapHero roadmap={roadmap} onAdapted={setRoadmap} onStatusChange={changeStatus} />

      {progress.percent === 100 ? (
        <div className="flex items-center gap-3 rounded-xl border border-petronas/40 bg-petronas/10 px-4 py-3">
          <Trophy className="h-4 w-4 shrink-0 text-petronas" />
          <p className="text-sm">
            <strong className="font-heading uppercase tracking-[0.16em] text-petronas">P1 da sua corrida:</strong> você
            concluiu todas as etapas deste roadmap.
          </p>
        </div>
      ) : null}

      <div className="space-y-4">
        {(roadmap.modules || []).map((module, index) => (
          <ModuleCard
            key={`${module.title}-${index}`}
            module={module}
            index={index}
            completedSteps={roadmap.completed_steps || []}
            onToggleStep={toggleStep}
            onOpenRadio={(mod, step) => setRadio({ module: mod, step })}
            onOpenQuiz={() => setQuiz({ module, index })}
            lastAttempt={lastAttemptByModule[index]}
          />
        ))}
      </div>

      <EngineerRadio
        open={!!radio}
        onOpenChange={(value) => (!value ? setRadio(null) : null)}
        roadmap={roadmap}
        module={radio?.module}
        step={radio?.step}
      />

      <SectorQuiz
        open={!!quiz}
        onOpenChange={(value) => (!value ? setQuiz(null) : null)}
        roadmap={roadmap}
        module={quiz?.module}
        moduleIndex={quiz?.index ?? 0}
        onSaved={(saved) => setAttempts((current) => [{ ...saved }, ...current])}
      />
    </div>
  );
}