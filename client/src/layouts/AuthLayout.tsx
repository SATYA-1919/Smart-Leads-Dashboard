import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/Logo';
import { CheckCircleIcon, ShieldIcon, SparklesIcon } from '@/components/ui/icons';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 lg:flex lg:flex-col lg:justify-between lg:p-12 lg:text-white">
        <div className="absolute inset-0 surface-grid opacity-50" />
        <div
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent-400/30 blur-3xl"
          aria-hidden
        />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              Turn cold leads into closed deals.
            </h2>
            <p className="mt-3 max-w-md text-white/80">
              Smart Leads gives your sales team a single, calm place to capture, qualify
              and convert opportunities.
            </p>
          </div>

          <ul className="space-y-3 text-sm">
            <Feature icon={<SparklesIcon className="h-4 w-4" />}>
              Smart filtering, search and sorting in real time
            </Feature>
            <Feature icon={<ShieldIcon className="h-4 w-4" />}>
              Role-based access for Admins and Sales users
            </Feature>
            <Feature icon={<CheckCircleIcon className="h-4 w-4" />}>
              One-click CSV exports of any filtered view
            </Feature>
          </ul>
        </div>

        <div className="relative text-xs text-white/60">
          &copy; {new Date().getFullYear()} Smart Leads. Built for ServiceHive.
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Logo />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
          </div>

          {children}

          {footer && (
            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              {footer}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-white/15 text-white ring-1 ring-inset ring-white/20">
        {icon}
      </span>
      <span className="text-white/90">{children}</span>
    </li>
  );
}
