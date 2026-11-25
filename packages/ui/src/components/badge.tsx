import * as React from 'react';
import { cn } from '../lib/utils';

export type BadgeVariant = 'neutral' | 'ready' | 'info' | 'warning' | 'danger';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  neutral:
    'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-default)]',
  ready:
    'bg-[var(--accent-operational-subtle)] text-[var(--accent-operational)] border-[var(--accent-operational)]/30',
  info:
    'bg-[var(--status-info-subtle)] text-[var(--status-info)] border-[var(--status-info)]/30',
  warning:
    'bg-[var(--status-warning-subtle)] text-[var(--status-warning)] border-[var(--status-warning)]/30',
  danger:
    'bg-[var(--status-danger-subtle)] text-[var(--status-danger)] border-[var(--status-danger)]/30',
};

export function Badge({
  className,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[6px] border px-2 py-0.5 text-xs font-medium leading-5',
        BADGE_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
