import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

const navClass = ({ isActive }) =>
  cn(
    'rounded-full px-3.5 py-1.5 font-heading text-[11px] uppercase tracking-[0.2em] transition duration-200',
    isActive
      ? 'bg-petronas/12 text-petronas ring-1 ring-petronas/40'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
  );

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground carbon-weave">
      <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-petronas/12 ring-1 ring-petronas/40">
              <Flag className="h-4 w-4 text-petronas" />
            </span>
            <span className="leading-none">
              <span className="block font-heading text-sm font-bold uppercase tracking-[0.22em]">AMG Roadmap</span>
              <span className="mt-0.5 block text-[9px] uppercase tracking-[0.32em] text-muted-foreground">
                Study Performance
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>
              Novo
            </NavLink>
            <NavLink to="/history" className={navClass}>
              Garagem
            </NavLink>
          </nav>
        </div>
        <div className="racing-stripe h-[2px] w-full opacity-80" />
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="no-print border-t border-border/60 py-6 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Keep pushing · Estude como um campeão
      </footer>
    </div>
  );
}