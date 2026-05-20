import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { extractApiError } from '@/api/client';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MailIcon, ShieldIcon } from '@/components/ui/icons';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setServerError(null);
    try {
      await login(data);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(extractApiError(err));
    }
  };

  const fillDemo = (email: string, password: string): void => {
    setValue('email', email, { shouldValidate: false });
    setValue('password', password, { shouldValidate: false });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Smart Leads account"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Create one
          </Link>
        </>
      }
    >
      {serverError && (
        <Alert className="mb-4" variant="error">
          {serverError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="input"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" className="text-white" /> : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <ShieldIcon className="h-3.5 w-3.5" /> Demo accounts
        </div>
        <div className="space-y-2">
          <DemoRow
            label="Admin"
            email="admin@smartleads.dev"
            password="admin123"
            onUse={fillDemo}
          />
          <DemoRow
            label="Sales User"
            email="sales@smartleads.dev"
            password="sales123"
            onUse={fillDemo}
          />
        </div>
      </div>
    </AuthLayout>
  );
}

interface DemoRowProps {
  label: string;
  email: string;
  password: string;
  onUse: (email: string, password: string) => void;
}

function DemoRow({ label, email, password, onUse }: DemoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex min-w-0 items-center gap-2">
        <MailIcon className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
        <div className="min-w-0">
          <div className="truncate font-medium text-slate-700 dark:text-slate-200">
            {label}
          </div>
          <div className="truncate text-slate-500 dark:text-slate-500">{email}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onUse(email, password)}
        className="flex-shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
      >
        Use
      </button>
    </div>
  );
}
