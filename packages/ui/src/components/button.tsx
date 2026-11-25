import * as React from 'react';
import { cn } from '../lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--brand-primary)] text-[var(--brand-primary-fg)] hover:opacity-90 border border-transparent',
  secondary:
    'bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:opacity-85 border border-[var(--border-default)]',
  outline:
    'bg-transparent text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-subtle)]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] border border-transparent',
  danger:
    'bg-[var(--status-danger)] text-white hover:opacity-90 border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs rounded-[6px]',
  md: 'h-10 px-4 text-sm rounded-[6px]',
  lg: 'h-11 px-5 text-sm rounded-[6px]',
  icon: 'h-11 w-11 rounded-[6px]',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-operational)]',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}
