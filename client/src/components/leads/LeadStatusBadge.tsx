import { cn } from '@/utils/cn';
import type { LeadStatus } from '@/types';

const styles: Record<LeadStatus, string> = {
  New: 'bg-blue-50 text-blue-700 ring-blue-200/70 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20',
  Contacted:
    'bg-amber-50 text-amber-800 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20',
  Qualified:
    'bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  Lost: 'bg-red-50 text-red-700 ring-red-200/70 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20',
};

const dotColors: Record<LeadStatus, string> = {
  New: 'bg-blue-500',
  Contacted: 'bg-amber-500',
  Qualified: 'bg-emerald-500',
  Lost: 'bg-red-500',
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn('badge', styles[status])}>
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[status])} aria-hidden />
      {status}
    </span>
  );
}
