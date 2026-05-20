import type { ReactNode, SVGProps } from 'react';
import { cn } from '@/utils/cn';

interface AlertProps {
  variant?: 'error' | 'info' | 'success';
  children: ReactNode;
  className?: string;
}

const styles: Record<NonNullable<AlertProps['variant']>, string> = {
  error:
    'border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200',
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200',
  success:
    'border-green-200 bg-green-50 text-green-900 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200',
};

export function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm',
        styles[variant],
        className,
      )}
    >
      <Icon variant={variant} className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Icon({
  variant,
  ...props
}: { variant: NonNullable<AlertProps['variant']> } & SVGProps<SVGSVGElement>) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (variant === 'success') {
    return (
      <svg {...common} {...props}>
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    );
  }
  if (variant === 'info') {
    return (
      <svg {...common} {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    );
  }
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}
