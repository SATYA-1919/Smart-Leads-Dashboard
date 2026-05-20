import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="card max-w-md p-8 text-center sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or
          deleted.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
