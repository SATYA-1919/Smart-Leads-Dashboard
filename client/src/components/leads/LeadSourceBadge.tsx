import { cn } from '@/utils/cn';
import type { LeadSource } from '@/types';

const styles: Record<LeadSource, string> = {
  Website:
    'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  Instagram:
    'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:ring-fuchsia-500/20',
  Referral:
    'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20',
};

export function LeadSourceBadge({ source }: { source: LeadSource }) {
  return <span className={cn('badge', styles[source])}>{source}</span>;
}
