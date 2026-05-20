import { LEAD_SOURCES, LEAD_STATUSES, type LeadFilters } from '@/types';
import { FilterIcon, SearchIcon } from '@/components/ui/icons';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  searchInput: string;
  onSearchChange: (val: string) => void;
  onFiltersChange: (next: Partial<LeadFilters>) => void;
  onReset: () => void;
}

export function LeadFiltersBar({
  filters,
  searchInput,
  onSearchChange,
  onFiltersChange,
  onReset,
}: LeadFiltersBarProps) {
  const activeFilterCount =
    (filters.status ? 1 : 0) + (filters.source ? 1 : 0) + (filters.search ? 1 : 0);

  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <FilterIcon className="h-4 w-4 text-slate-400" />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              {activeFilterCount} active
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            onClick={onReset}
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <label className="label" htmlFor="search">
            Search
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="search"
              type="search"
              placeholder="Search by name or email…"
              className="input pl-9"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="input"
            value={filters.status ?? ''}
            onChange={(e) =>
              onFiltersChange({
                status: e.target.value ? (e.target.value as LeadFilters['status']) : undefined,
              })
            }
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="source">
            Source
          </label>
          <select
            id="source"
            className="input"
            value={filters.source ?? ''}
            onChange={(e) =>
              onFiltersChange({
                source: e.target.value ? (e.target.value as LeadFilters['source']) : undefined,
              })
            }
          >
            <option value="">All sources</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            className="input"
            value={filters.sort}
            onChange={(e) => onFiltersChange({ sort: e.target.value as LeadFilters['sort'] })}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
