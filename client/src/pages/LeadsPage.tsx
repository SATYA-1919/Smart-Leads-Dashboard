import { useEffect, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLeadRequest,
  deleteLeadRequest,
  exportLeadsCsvRequest,
  getLeadStatsRequest,
  listLeadsRequest,
  updateLeadRequest,
  type CreateLeadPayload,
  type UpdateLeadPayload,
} from '@/api/leads';
import { extractApiError } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { LeadFilters } from '@/types';
import { LeadFiltersBar } from '@/components/leads/LeadFiltersBar';
import { LeadTable } from '@/components/leads/LeadTable';
import { Pagination } from '@/components/leads/Pagination';
import type { LeadFormData } from '@/components/leads/LeadForm';
import { LeadModals, type LeadModalState } from '@/components/leads/LeadModals';
import { LeadStats } from '@/components/leads/LeadStats';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { DownloadIcon, PlusIcon } from '@/components/ui/icons';

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: 10,
  sort: 'latest',
};

const STATS_QUERY_KEY = ['leadStats'] as const;
const LEADS_QUERY_KEY = ['leads'] as const;

export function LeadsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'Admin';

  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [modal, setModal] = useState<LeadModalState>({ kind: 'none' });
  const [actionError, setActionError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    setFilters((prev) => {
      const trimmed = debouncedSearch.trim();
      const nextSearch = trimmed.length > 0 ? trimmed : undefined;
      if (prev.search === nextSearch) return prev;
      return { ...prev, search: nextSearch, page: 1 };
    });
  }, [debouncedSearch]);

  const leadsQuery = useQuery({
    queryKey: [...LEADS_QUERY_KEY, filters],
    queryFn: () => listLeadsRequest(filters),
    placeholderData: keepPreviousData,
  });

  const statsQuery = useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: getLeadStatsRequest,
  });

  const invalidateLists = (): void => {
    queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateLeadPayload) => createLeadRequest(payload),
    onSuccess: () => {
      invalidateLists();
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (args: { id: string; payload: UpdateLeadPayload }) =>
      updateLeadRequest(args.id, args.payload),
    onSuccess: () => {
      invalidateLists();
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLeadRequest(id),
    onSuccess: () => {
      invalidateLists();
      closeModal();
    },
  });

  const handleFiltersChange = (next: Partial<LeadFilters>): void => {
    setFilters((prev) => ({ ...prev, ...next, page: 1 }));
  };

  const handleReset = (): void => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  };

  const handleCreate = async (data: LeadFormData): Promise<void> => {
    setActionError(null);
    try {
      await createMutation.mutateAsync(data);
    } catch (err) {
      setActionError(extractApiError(err));
    }
  };

  const handleEdit = async (data: LeadFormData): Promise<void> => {
    if (modal.kind !== 'edit') return;
    setActionError(null);
    try {
      await updateMutation.mutateAsync({ id: modal.lead._id, payload: data });
    } catch (err) {
      setActionError(extractApiError(err));
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (modal.kind !== 'delete') return;
    setActionError(null);
    try {
      await deleteMutation.mutateAsync(modal.lead._id);
    } catch (err) {
      setActionError(extractApiError(err));
    }
  };

  const handleExport = async (): Promise<void> => {
    setActionError(null);
    setExportLoading(true);
    try {
      const blob = await exportLeadsCsvRequest({
        status: filters.status,
        source: filters.source,
        search: filters.search,
        sort: filters.sort,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setActionError(extractApiError(err));
    } finally {
      setExportLoading(false);
    }
  };

  function closeModal(): void {
    setModal({ kind: 'none' });
    setActionError(null);
  }

  const leads = leadsQuery.data?.leads ?? [];
  const meta = leadsQuery.data?.meta;
  const stats = statsQuery.data ?? {
    total: 0,
    byStatus: { New: 0, Contacted: 0, Qualified: 0, Lost: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Leads
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''} — here&apos;s what&apos;s
            happening in your pipeline.
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          {isAdmin && (
            <button
              type="button"
              className="btn-secondary flex-1 sm:flex-initial"
              onClick={handleExport}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <DownloadIcon className="h-4 w-4" />
                  <span>Export CSV</span>
                </>
              )}
            </button>
          )}
          <button
            type="button"
            className="btn-primary flex-1 sm:flex-initial"
            onClick={() => setModal({ kind: 'create' })}
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <LeadStats value={stats} loading={statsQuery.isLoading} />

      {actionError && modal.kind === 'none' && <Alert variant="error">{actionError}</Alert>}

      {/* Filters */}
      <LeadFiltersBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      {/* Table card */}
      <div className="card overflow-hidden">
        {leadsQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : leadsQuery.isError ? (
          <div className="p-4">
            <Alert variant="error">{extractApiError(leadsQuery.error)}</Alert>
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting your filters, or create your first lead to get started."
            action={
              <button
                type="button"
                className="btn-primary"
                onClick={() => setModal({ kind: 'create' })}
              >
                <PlusIcon className="h-4 w-4" />
                New Lead
              </button>
            }
          />
        ) : (
          <>
            <LeadTable
              leads={leads}
              canDelete={isAdmin}
              onView={(lead) => setModal({ kind: 'view', lead })}
              onEdit={(lead) => setModal({ kind: 'edit', lead })}
              onDelete={(lead) => setModal({ kind: 'delete', lead })}
            />
            {meta && (
              <Pagination
                meta={meta}
                onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              />
            )}
          </>
        )}
      </div>

      <LeadModals
        state={modal}
        actionError={actionError}
        isDeleting={deleteMutation.isPending}
        onClose={closeModal}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
