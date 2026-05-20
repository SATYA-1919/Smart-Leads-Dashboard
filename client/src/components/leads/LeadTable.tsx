import type { ReactNode } from 'react';
import type { Lead } from '@/types';
import { LeadStatusBadge } from './LeadStatusBadge';

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
  hour: '2-digit',
  minute: '2-digit',
});

export function LeadTable({ leads, canDelete, onView, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-900/50">
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Source</Th>
            <Th>Created</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <Td className="font-medium">{lead.name}</Td>
              <Td className="text-slate-600 dark:text-slate-400">{lead.email}</Td>
              <Td><LeadStatusBadge status={lead.status} /></Td>
              <Td>{lead.source}</Td>
              <Td className="whitespace-nowrap text-slate-500 dark:text-slate-400">
                {dateFormatter.format(new Date(lead.createdAt))}
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                    onClick={() => onView(lead)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="text-sm font-medium text-slate-700 hover:underline dark:text-slate-300"
                    onClick={() => onEdit(lead)}
                  >
                    Edit
                  </button>
                  {canDelete && (
                    <button
                      type="button"
                      className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                      onClick={() => onDelete(lead)}
                    >
                      Delete
                    </button>
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
  return <td className={`px-4 py-3 text-sm ${className ?? ''}`}>{children}</td>;
}
