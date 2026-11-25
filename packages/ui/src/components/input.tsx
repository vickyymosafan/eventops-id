import * as React from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      aria-invalid={hasError || undefined}
      className={cn(
        'flex h-10 w-full rounded-[6px] border bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent-operational)] disabled:cursor-not-allowed disabled:opacity-50',
        hasError
          ? 'border-[var(--status-danger)]'
          : 'border-[var(--border-default)]',
        className,
      )}
      {...props}
    />
  );
}
