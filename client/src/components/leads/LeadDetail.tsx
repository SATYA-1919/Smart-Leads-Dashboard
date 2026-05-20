import type { ReactNode } from 'react';
import type { Lead } from '@/types';
import { LeadStatusBadge } from './LeadStatusBadge';

interface LeadDetailProps {
  lead: Lead;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function LeadDetail({ lead }: LeadDetailProps) {
  return (
    <dl className="space-y-3">
      <Row label="Name" value={lead.name} />
      <Row label="Email" value={lead.email} />
      <Row label="Status" value={<LeadStatusBadge status={lead.status} />} />
      <Row label="Source" value={lead.source} />
      <Row label="Created" value={dateFormatter.format(new Date(lead.createdAt))} />
      <Row label="Last updated" value={dateFormatter.format(new Date(lead.updatedAt))} />
    </dl>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="col-span-2 text-sm text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}
