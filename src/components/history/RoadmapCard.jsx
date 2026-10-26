import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExternalLink, Printer, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import TelemetryBar from '@/components/roadmap/TelemetryBar';
import { goalLabel, levelLabel, progressOf, statusLabel } from '@/lib/roadmapUtils';

export default function RoadmapCard({ roadmap, onDelete }) {
  const progress = progressOf(roadmap);
  const date = roadmap.updated_date || roadmap.created_date;

  return (
    <article className="animate-rise flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-4 shadow-panel backdrop-blur transition hover:border-petronas/40 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading text-[10px] uppercase tracking-[0.3em] text-petronas">{roadmap.topic}</p>
          <h3 className="mt-2 truncate font-heading text-lg font-semibold tracking-tight">{roadmap.title}</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {levelLabel(roadmap.level)} · {goalLabel(roadmap.goal_type)}
            {date ? ` · atualizado em ${format(new Date(date), 'dd MMM yyyy', { locale: ptBR })}` : ''}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-border px-2.5 py-1 font-heading text-[10px] uppercase tracking-[0.16em] text-silver">
          {statusLabel(roadmap.status)}
        </span>
      </div>

      <TelemetryBar percent={progress.percent} label={`${progress.done}/${progress.total} etapas`} />

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Button
          asChild
          size="sm"
          className="h-9 bg-petronas font-heading text-[10px] uppercase tracking-[0.18em] text-primary-foreground hover:bg-petronas-soft"
        >
          <Link to={`/roadmap/${roadmap.id}`}>
            Abrir cockpit
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-9 border-border font-heading text-[10px] uppercase tracking-[0.18em] hover:border-petronas/50 hover:text-petronas"
        >
          <Link to={`/print/${roadmap.id}`}>
            <Printer className="mr-2 h-3.5 w-3.5" />
            PDF
          </Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto h-9 px-2 text-muted-foreground hover:bg-race/10 hover:text-race"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-border bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-heading uppercase tracking-[0.14em]">
                Remover da garagem?
              </AlertDialogTitle>
              <AlertDialogDescription>
                O roadmap "{roadmap.title}" e o seu progresso serão apagados. Isso não pode ser desfeito.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border bg-transparent">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(roadmap)}
                className="bg-race text-destructive-foreground hover:bg-race/90"
              >
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}