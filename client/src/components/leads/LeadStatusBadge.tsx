import { cn } from '@/utils/cn';
import type { LeadStatus } from '@/types';

const styles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  Contacted: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  Qualified: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <span className={cn('badge', styles[status])}>{status}</span>;
}
