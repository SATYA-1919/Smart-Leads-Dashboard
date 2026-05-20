import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { extractApiError } from '@/api/client';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { AuthLayout } from '@/layouts/AuthLayout';
import { USER_ROLES } from '@/types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(USER_ROLES),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'SalesUser' },
  });

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setServerError(null);
    try {
      await registerUser(data);
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(extractApiError(err));
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing your leads in minutes"
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
          >
            Sign in
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
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            className="input"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

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
            autoComplete="new-password"
            placeholder="At least 6 characters"
            className="input"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="role">
            Role
          </label>
          <select id="role" className="input" {...register('role')}>
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              {errors.role.message}
            </p>
          )}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? <Spinner size="sm" className="text-white" /> : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
