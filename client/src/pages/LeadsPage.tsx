import { useEffect, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLeadRequest,
  deleteLeadRequest,
  exportLeadsCsvRequest,
  listLeadsRequest,
  updateLeadRequest,
  type CreateLeadPayload,
  type UpdateLeadPayload,
} from '@/api/leads';
import { extractApiError } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { Lead, LeadFilters } from '@/types';
import { LeadFiltersBar } from '@/components/leads/LeadFiltersBar';
import { LeadTable } from '@/components/leads/LeadTable';
import { Pagination } from '@/components/leads/Pagination';
import { LeadForm, type LeadFormData } from '@/components/leads/LeadForm';
import { LeadDetail } from '@/components/leads/LeadDetail';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: 10,
  sort: 'latest',
};

type ModalState =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; lead: Lead }
  | { kind: 'view'; lead: Lead }
  | { kind: 'delete'; lead: Lead };

export function LeadsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'Admin';

  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [modal, setModal] = useState<ModalState>({ kind: 'none' });
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
    queryKey: ['leads', filters],
    queryFn: () => listLeadsRequest(filters),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateLeadPayload) => createLeadRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setModal({ kind: 'none' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (args: { id: string; payload: UpdateLeadPayload }) =>
      updateLeadRequest(args.id, args.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setModal({ kind: 'none' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLeadRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setModal({ kind: 'none' });
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

  const closeModal = (): void => {
    setModal({ kind: 'none' });
    setActionError(null);
  };

  const leads = leadsQuery.data?.leads ?? [];
  const meta = leadsQuery.data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your sales pipeline
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <button
              type="button"
              className="btn-secondary"
              onClick={handleExport}
              disabled={exportLoading}
            >
              {exportLoading ? <Spinner size="sm" /> : 'Export CSV'}
            </button>
          )}
          <button type="button" className="btn-primary" onClick={() => setModal({ kind: 'create' })}>
            + New Lead
          </button>
        </div>
      </div>

      {actionError && <Alert variant="error">{actionError}</Alert>}

      <LeadFiltersBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      <div className="card overflow-hidden">
        {leadsQuery.isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : leadsQuery.isError ? (
          <div className="p-4">
            <Alert variant="error">{extractApiError(leadsQuery.error)}</Alert>
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description="Try adjusting filters, or create your first lead."
            action={
              <button className="btn-primary" onClick={() => setModal({ kind: 'create' })}>
                + New Lead
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
            {meta && <Pagination meta={meta} onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))} />}
          </>
        )}
      </div>

      <Modal open={modal.kind === 'create'} onClose={closeModal} title="Create lead">
        {actionError && <Alert className="mb-3" variant="error">{actionError}</Alert>}
        <LeadForm onSubmit={handleCreate} onCancel={closeModal} submitLabel="Create" />
      </Modal>

      <Modal
        open={modal.kind === 'edit'}
        onClose={closeModal}
        title="Edit lead"
      >
        {actionError && <Alert className="mb-3" variant="error">{actionError}</Alert>}
        {modal.kind === 'edit' && (
          <LeadForm
            initialValues={modal.lead}
            onSubmit={handleEdit}
            onCancel={closeModal}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      <Modal open={modal.kind === 'view'} onClose={closeModal} title="Lead details">
        {modal.kind === 'view' && <LeadDetail lead={modal.lead} />}
        <div className="mt-4 flex justify-end">
          <button className="btn-secondary" onClick={closeModal}>Close</button>
        </div>
      </Modal>

      <Modal open={modal.kind === 'delete'} onClose={closeModal} title="Delete lead" size="sm">
        {actionError && <Alert className="mb-3" variant="error">{actionError}</Alert>}
        {modal.kind === 'delete' && (
          <>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to delete <span className="font-semibold">{modal.lead.name}</span>?
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-secondary" onClick={closeModal} disabled={deleteMutation.isPending}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? <Spinner size="sm" className="text-white" /> : 'Delete'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
