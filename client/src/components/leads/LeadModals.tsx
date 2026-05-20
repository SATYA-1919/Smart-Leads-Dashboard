import type { Lead } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { LeadDetail } from './LeadDetail';
import { LeadForm, type LeadFormData } from './LeadForm';

export type LeadModalState =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; lead: Lead }
  | { kind: 'view'; lead: Lead }
  | { kind: 'delete'; lead: Lead };

interface LeadModalsProps {
  state: LeadModalState;
  actionError: string | null;
  isDeleting: boolean;
  onClose: () => void;
  onCreate: (data: LeadFormData) => Promise<void>;
  onEdit: (data: LeadFormData) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function LeadModals({
  state,
  actionError,
  isDeleting,
  onClose,
  onCreate,
  onEdit,
  onDelete,
}: LeadModalsProps) {
  return (
    <>
      <Modal
        open={state.kind === 'create'}
        onClose={onClose}
        title="Create new lead"
        description="Add a new lead to your pipeline."
      >
        {actionError && (
          <Alert className="mb-3" variant="error">
            {actionError}
          </Alert>
        )}
        <LeadForm onSubmit={onCreate} onCancel={onClose} submitLabel="Create lead" />
      </Modal>

      <Modal
        open={state.kind === 'edit'}
        onClose={onClose}
        title="Edit lead"
        description="Update this lead's information."
      >
        {actionError && (
          <Alert className="mb-3" variant="error">
            {actionError}
          </Alert>
        )}
        {state.kind === 'edit' && (
          <LeadForm
            initialValues={state.lead}
            onSubmit={onEdit}
            onCancel={onClose}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      <Modal
        open={state.kind === 'view'}
        onClose={onClose}
        title="Lead details"
        size="md"
      >
        {state.kind === 'view' && <LeadDetail lead={state.lead} />}
        <div className="mt-5 flex justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </Modal>

      <Modal
        open={state.kind === 'delete'}
        onClose={onClose}
        title="Delete lead"
        size="sm"
      >
        {actionError && (
          <Alert className="mb-3" variant="error">
            {actionError}
          </Alert>
        )}
        {state.kind === 'delete' && (
          <>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {state.lead.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={onDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Spinner size="sm" className="text-white" /> : 'Delete'}
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
