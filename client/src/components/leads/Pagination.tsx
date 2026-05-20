import type { PaginationMeta } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = meta;
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row dark:border-slate-800">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{start}</span>–
        <span className="font-semibold text-slate-900 dark:text-slate-100">{end}</span> of{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-100">{total}</span> leads
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-secondary !px-3"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <span className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className="btn-secondary !px-3"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
