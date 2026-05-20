import type { PaginationMeta } from '@/types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, hasNextPage, hasPrevPage } = meta;
  if (total === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row dark:border-slate-800">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Page <span className="font-semibold">{page}</span> of{' '}
        <span className="font-semibold">{totalPages}</span> · {total} total
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
