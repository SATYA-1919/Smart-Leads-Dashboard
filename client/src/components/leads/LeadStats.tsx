import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { LeadStatus } from '@/types';

export interface LeadStatsValue {
  total: number;
  byStatus: Record<LeadStatus, number>;
}

interface LeadStatsProps {
  value: LeadStatsValue;
  loading?: boolean;
}

interface Tile {
  label: string;
  value: number;
  tone: string;
  accent: string;
}

export function LeadStats({ value, loading = false }: LeadStatsProps) {
  const tiles: Tile[] = [
    {
      label: 'Total leads',
      value: value.total,
      tone: 'from-brand-500 to-accent-500',
      accent: 'text-brand-600 dark:text-brand-400',
    },
    {
      label: 'New',
      value: value.byStatus.New,
      tone: 'from-blue-500 to-cyan-500',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Qualified',
      value: value.byStatus.Qualified,
      tone: 'from-emerald-500 to-teal-500',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Lost',
      value: value.byStatus.Lost,
      tone: 'from-rose-500 to-red-500',
      accent: 'text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {tiles.map((t) => (
        <StatCard key={t.label} tile={t} loading={loading} />
      ))}
    </div>
  );
}

function StatCard({ tile, loading }: { tile: Tile; loading: boolean }) {
  return (
    <div className="card-hover relative overflow-hidden p-4 sm:p-5">
      <div
        className={cn(
          'absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-15 blur-2xl',
          tile.tone,
        )}
        aria-hidden
      />
      <div className="relative">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {tile.label}
        </div>
        <div className="mt-2 flex items-end justify-between">
          {loading ? (
            <div className="h-8 w-12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          ) : (
            <div className={cn('text-3xl font-bold tracking-tight', tile.accent)}>
              {tile.value.toLocaleString()}
            </div>
          )}
          <Bar tone={tile.tone} />
        </div>
      </div>
    </div>
  );
}

function Bar({ tone }: { tone: string }): ReactNode {
  return (
    <div className="flex items-end gap-0.5">
      {[2, 4, 3, 6].map((h, i) => (
        <div
          key={i}
          className={cn('w-1 rounded-sm bg-gradient-to-t', tone)}
          style={{ height: `${h * 4}px` }}
        />
      ))}
    </div>
  );
}
