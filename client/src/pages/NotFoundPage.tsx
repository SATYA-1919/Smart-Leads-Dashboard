import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-md p-8 text-center">
        <h1 className="text-5xl font-bold text-brand-600 dark:text-brand-400">404</h1>
        <p className="mt-3 text-lg font-medium">Page not found</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Go home</Link>
      </div>
    </div>
  );
}
