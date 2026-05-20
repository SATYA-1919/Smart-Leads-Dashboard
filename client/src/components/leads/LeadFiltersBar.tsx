import { LEAD_SOURCES, LEAD_STATUSES, type LeadFilters } from '@/types';

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
  return (
    <div className="card p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4">
          <label className="label" htmlFor="search">Search by name or email</label>
          <input
            id="search"
            type="search"
            placeholder="e.g. Rahul or rahul@example.com"
            className="input"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="status">Status</label>
          <select
            id="status"
            className="input"
            value={filters.status ?? ''}
            onChange={(e) =>
              onFiltersChange({ status: e.target.value ? (e.target.value as LeadFilters['status']) : undefined })
            }
          >
            <option value="">All</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="source">Source</label>
          <select
            id="source"
            className="input"
            value={filters.source ?? ''}
            onChange={(e) =>
              onFiltersChange({ source: e.target.value ? (e.target.value as LeadFilters['source']) : undefined })
            }
          >
            <option value="">All</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="label" htmlFor="sort">Sort by</label>
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

        <div className="md:col-span-2">
          <button type="button" className="btn-secondary w-full" onClick={onReset}>
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}
