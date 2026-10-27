import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Plus, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RoadmapCard from '@/components/history/RoadmapCard';
import { STATUSES, forgetRoadmap, localRoadmapIds } from '@/lib/roadmapUtils';
import { cn } from '@/lib/utils';

const FILTERS = [{ value: 'todos', label: 'Todos' }, ...STATUSES];

export default function History() {
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [status, setStatus] = useState('todos');
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me().catch(() => null);
      setUser(me);
      setReady(true);
    })();
  }, []);

  const scopeQuery = (currentUser) =>
    currentUser ? { created_by_id: currentUser.id } : { id: { $in: localRoadmapIds() } };

  const listQuery = (currentUser) => {
    const query = scopeQuery(currentUser);
    if (status !== 'todos') query.status = status;
    if (search.trim()) query.topic = { $regex: search.trim(), $options: 'i' };
    return query;
  };

  useEffect(() => {
    if (!ready) return;
    if (!user && localRoadmapIds().length === 0) {
      setItems([]);
      setCounts({});
      setLoading(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const page = await base44.entities.Roadmap.filter(listQuery(user), { sort: '-created_date', limit: 12 });
      setItems(page.items || []);
      setCursor(page.next_cursor || null);
      setHasMore(!!page.has_more);
      try {
        const aggregate = await base44.entities.Roadmap.aggregate({ query: scopeQuery(user), groupBy: 'status' });
        const map = {};
        (aggregate.rows || []).forEach((row) => {
          map[row.status] = row.count;
        });
        setCounts(map);
      } catch (e) {
        setCounts({});
      }
      setLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [ready, user, status, search]);

  const loadMore = async () => {
    if (!cursor) return;
    setLoadingMore(true);
    const page = await base44.entities.Roadmap.filter(listQuery(user), {
      sort: '-created_date',
      limit: 12,
      cursor,
    });
    setItems((current) => [...current, ...(page.items || [])]);
    setCursor(page.next_cursor || null);
    setHasMore(!!page.has_more);
    setLoadingMore(false);
  };

  const handleDelete = async (roadmap) => {
    setItems((current) => current.filter((item) => item.id !== roadmap.id));
    forgetRoadmap(roadmap.id);
    await base44.entities.Roadmap.delete(roadmap.id);
  };

  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-heading text-[10px] uppercase tracking-[0.4em] text-petronas">Garagem</p>
          <h1 className="mt-2.5 font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Histórico de roadmaps
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tudo que você gerou fica salvo aqui, com o progresso de cada plano.
          </p>
        </div>
        <Button
          asChild
          className="h-10 bg-petronas font-heading text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-petronas-soft"
        >
          <Link to="/">
            <Plus className="mr-2 h-4 w-4" />
            Novo roadmap
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatus(filter.value)}
              className={cn(
                'rounded-full px-3 py-1.5 font-heading text-[10px] uppercase tracking-[0.16em] transition',
                status === filter.value
                  ? 'bg-petronas/15 text-petronas ring-1 ring-petronas/40'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {filter.label}
              {filter.value !== 'todos' && counts[filter.value] ? ` (${counts[filter.value]})` : ''}
              {filter.value === 'todos' && total ? ` (${total})` : ''}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por tema..."
            className="h-10 border-border bg-background/60 pl-9 focus-visible:ring-petronas"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-petronas" />
          Consultando a telemetria...
        </div>
      ) : null}

      {!loading && items.length === 0 ? (
        <div className="cockpit-panel border border-border bg-card/50 px-6 py-14 text-center">
          <div className="chequer mx-auto h-12 w-24 rounded opacity-10" />
          <p className="mt-4 font-heading text-lg uppercase tracking-[0.16em]">Garagem vazia</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Nenhum roadmap por aqui ainda. Gere o primeiro e ele aparece nesta lista, pronto para retomar ou imprimir.
          </p>
          <Button
            asChild
            className="mt-5 h-10 bg-petronas font-heading text-[11px] uppercase tracking-[0.2em] text-primary-foreground hover:bg-petronas-soft"
          >
            <Link to="/">Gerar meu primeiro roadmap</Link>
          </Button>
        </div>
      ) : null}

      {!loading && items.length > 0 ? (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <RoadmapCard key={item.id} roadmap={item} onDelete={handleDelete} />
            ))}
          </div>
          {hasMore ? (
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                variant="outline"
                className="h-10 border-border font-heading text-[11px] uppercase tracking-[0.2em] hover:border-petronas/50 hover:text-petronas"
              >
                {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Carregar mais
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}