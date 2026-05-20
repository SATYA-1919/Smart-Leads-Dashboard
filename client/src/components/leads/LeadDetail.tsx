import type { ReactNode } from 'react';
import type { Lead } from '@/types';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadSourceBadge } from './LeadSourceBadge';

interface LeadDetailProps {
  lead: Lead;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function LeadDetail({ lead }: LeadDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-base font-bold text-white">
          {initials(lead.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-bold text-slate-900 dark:text-slate-50">
            {lead.name}
          </div>
          <div className="truncate text-sm text-slate-500 dark:text-slate-400">{lead.email}</div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        <Cell label="Status">
          <LeadStatusBadge status={lead.status} />
        </Cell>
        <Cell label="Source">
          <LeadSourceBadge source={lead.source} />
        </Cell>
        <Cell label="Created">
          <span className="text-sm text-slate-800 dark:text-slate-200">
            {dateFormatter.format(new Date(lead.createdAt))}
          </span>
        </Cell>
        <Cell label="Last updated">
          <span className="text-sm text-slate-800 dark:text-slate-200">
            {dateFormatter.format(new Date(lead.updatedAt))}
          </span>
        </Cell>
      </dl>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2.5 dark:border-slate-800">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
