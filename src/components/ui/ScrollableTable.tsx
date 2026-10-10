import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A wide table that scrolls inside its own box instead of the page.
 *
 * `relative` is load-bearing: absolutely positioned descendants (notably
 * `sr-only` labels) are only clipped by an ancestor's overflow when that
 * ancestor is their containing block. Without it they escape the box and give
 * the whole page a horizontal scrollbar.
 *
 * `tabIndex={0}` with a role and label makes the box focusable, so the table
 * can be scrolled with a keyboard.
 */
export function ScrollableTable({
  label,
  children,
  className,
  ...rest
}: {
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'role' | 'aria-label'>) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={label}
      className={cn('relative overflow-x-auto', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
