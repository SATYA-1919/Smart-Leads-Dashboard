import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface AlertProps {
  variant?: 'error' | 'info' | 'success';
  children: ReactNode;
  className?: string;
}

const styles: Record<NonNullable<AlertProps['variant']>, string> = {
  error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200',
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200',
  success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200',
};

export function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn('rounded-md border px-3 py-2 text-sm', styles[variant], className)}
    >
      {children}
    </div>
  );
}
