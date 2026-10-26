import React, { useEffect, useRef, useState } from 'react';
import { Headphones, Loader2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { askEngineer } from '@/lib/roadmapAi';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  'Explique de forma simples',
  'Me dê um exemplo prático',
  'Estou travado nisso',
  'Como sei que estou pronto?',
];

const OPENING = 'Me explique esta etapa de forma simples e diga por onde eu começo.';

export default function EngineerRadio({ open, onOpenChange, roadmap, module, step }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const runTurn = async (question, history) => {
    const userMessage = {
      roadmap_id: roadmap.id,
      step_key: step.key,
      step_title: step.title,
      role: 'user',
      content: question,
    };
    const nextMessages = [...history, userMessage];
    setMessages(nextMessages);
    setLoading(true);
    setError('');
    try {
      const answer = await askEngineer({ roadmap, module, step, history, question });
      const assistantMessage = {
        roadmap_id: roadmap.id,
        step_key: step.key,
        step_title: step.title,
        role: 'assistant',
        content: answer,
      };
      setMessages((current) => [...current, assistantMessage]);
      await base44.entities.TutorMessage.create(userMessage);
      await base44.entities.TutorMessage.create(assistantMessage);
    } catch (e) {
      setError('O rádio saiu do ar por um instante. Tente enviar de novo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !step || !roadmap?.id) return;
    let active = true;
    setMessages([]);
    setError('');
    (async () => {
      const page = await base44.entities.TutorMessage.filter(
        { roadmap_id: roadmap.id, step_key: step.key },
        { sort: 'created_date', limit: 50 }
      );
      if (!active) return;
      const history = page.items || [];
      setMessages(history);
      if (history.length === 0) runTurn(OPENING, []);
    })();
    return () => {
      active = false;
    };
  }, [open, step?.key, roadmap?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const send = (text) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    setInput('');
    runTurn(question, messages);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading uppercase tracking-[0.16em]">
            <Headphones className="h-4 w-4 text-petronas" />
            Rádio do engenheiro
          </DialogTitle>
          <DialogDescription>{step?.title}</DialogDescription>
        </DialogHeader>

        <div className="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                  message.role === 'user'
                    ? 'bg-secondary text-foreground'
                    : 'border border-petronas/30 bg-petronas/8 text-foreground/95'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading ? (
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-petronas">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Engenheiro falando no rádio...
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 2 ? (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition hover:border-petronas/50 hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        {error ? <p className="text-sm text-race">{error}</p> : null}

        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Pergunte o que quiser sobre esta etapa..."
            className="border-border bg-background/60 focus-visible:ring-petronas"
          />
          <Button
            type="button"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="h-10 bg-petronas px-4 text-primary-foreground hover:bg-petronas-soft disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}