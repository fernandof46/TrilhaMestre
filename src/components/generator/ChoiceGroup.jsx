import React from 'react';
import { cn } from '@/lib/utils';

export default function ChoiceGroup({ label, options, value, onChange, variant = 'cards' }) {
  return (
    <div>
      <span className="mb-2 block font-heading text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
      <div className={cn('gap-2', variant === 'cards' ? 'grid sm:grid-cols-3' : 'flex flex-wrap')}>
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'text-left transition duration-200',
                variant === 'cards'
                  ? 'rounded-xl border px-4 py-3'
                  : 'rounded-full border px-4 py-1.5 font-heading text-[11px] uppercase tracking-[0.18em]',
                active
                  ? 'border-petronas bg-petronas/10 text-foreground ring-1 ring-petronas/40'
                  : 'border-border bg-card/60 text-muted-foreground hover:border-silver/40 hover:text-foreground'
              )}
            >
              <span className="block text-sm font-medium">{option.label}</span>
              {variant === 'cards' && option.hint ? (
                <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">{option.hint}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}