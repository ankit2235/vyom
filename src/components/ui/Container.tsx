import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** 1280px max width, 32px side padding (16px on phones). */
export function Container({
  children,
  className,
}: {
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <div className={cn('mx-auto w-full max-w-[1280px] px-4 sm:px-8', className)}>{children}</div>
  );
}
