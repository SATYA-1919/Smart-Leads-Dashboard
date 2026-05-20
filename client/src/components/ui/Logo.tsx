import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M4 16l5-8 3 5 2-3 6 8H4z"
            fill="currentColor"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Smart<span className="text-brand-600 dark:text-brand-400">Leads</span>
        </span>
      )}
    </div>
  );
}
