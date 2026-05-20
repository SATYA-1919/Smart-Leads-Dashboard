import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES, type Lead } from '@/types';
import { Spinner } from '../ui/Spinner';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  email: z.string().email('Invalid email'),
  status: z.enum(LEAD_STATUSES),
  source: z.enum(LEAD_SOURCES),
});

export type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialValues?: Partial<Lead>;
  onSubmit: (data: LeadFormData) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}

export function LeadForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save' }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      email: initialValues?.email ?? '',
      status: initialValues?.status ?? 'New',
      source: initialValues?.source ?? 'Website',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="label" htmlFor="lead-name">Name</label>
        <input id="lead-name" type="text" className="input" {...register('name')} />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="lead-email">Email</label>
        <input id="lead-email" type="email" className="input" {...register('email')} />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="lead-status">Status</label>
          <select id="lead-status" className="input" {...register('status')}>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="lead-source">Source</label>
          <select id="lead-source" className="input" {...register('source')}>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" className="text-white" /> : submitLabel}
        </button>
      </div>
    </form>
  );
}
