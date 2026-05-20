import type { ReactNode } from 'react';
import type { Lead } from '@/types';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadSourceBadge } from './LeadSourceBadge';
import { EyeIcon, PencilIcon, TrashIcon } from '@/components/ui/icons';

interface LeadTableProps {
  leads: Lead[];
  canDelete: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
});

export function LeadTable({ leads, canDelete, onView, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="border-b border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
          <tr>
            <Th>Lead</Th>
            <Th>Status</Th>
            <Th>Source</Th>
            <Th>Created</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="group transition hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
            >
              <Td>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-xs font-bold text-brand-700 ring-1 ring-brand-500/15 dark:text-brand-300">
                    {initials(lead.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {lead.name}
                    </div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {lead.email}
                    </div>
                  </div>
                </div>
              </Td>
              <Td>
                <LeadStatusBadge status={lead.status} />
              </Td>
              <Td>
                <LeadSourceBadge source={lead.source} />
              </Td>
              <Td className="whitespace-nowrap">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {dateFormatter.format(new Date(lead.createdAt))}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  {timeFormatter.format(new Date(lead.createdAt))}
                </div>
              </Td>
              <Td className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <ActionButton
                    label="View"
                    onClick={() => onView(lead)}
                    tone="brand"
                    icon={<EyeIcon className="h-4 w-4" />}
                  />
                  <ActionButton
                    label="Edit"
                    onClick={() => onEdit(lead)}
                    tone="slate"
                    icon={<PencilIcon className="h-4 w-4" />}
                  />
                  {canDelete && (
                    <ActionButton
                      label="Delete"
                      onClick={() => onDelete(lead)}
                      tone="danger"
                      icon={<TrashIcon className="h-4 w-4" />}
                    />
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${className ?? ''}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 text-sm ${className ?? ''}`}>{children}</td>;
}

type Tone = 'brand' | 'slate' | 'danger';

const toneStyles: Record<Tone, string> = {
  brand:
    'text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-500/10',
  slate:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  danger:
    'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10',
};

interface ActionButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  tone: Tone;
}

function ActionButton({ label, icon, onClick, tone }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${toneStyles[tone]}`}
    >
      {icon}
    </button>
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
