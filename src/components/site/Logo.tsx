import Link from 'next/link';
import { cn } from '@/lib/cn';

/** The orbit mark: ellipse, body, satellite. */
export function LogoMark({ size = 30, className }: { readonly size?: number; readonly className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden="true" className={className}>
      <ellipse
        cx="15"
        cy="15"
        rx="13"
        ry="5.2"
        transform="rotate(-28 15 15)"
        stroke="var(--color-accent)"
        strokeWidth="1.6"
      />
      <circle cx="15" cy="15" r="5.4" fill="var(--color-primary)" />
      <circle cx="26.4" cy="8.9" r="2" fill="var(--color-accent)" />
    </svg>
  );
}

/** Mark plus wordmark, linking home. */
export function Logo({ className }: { readonly className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Vyom home"
      className={cn('flex min-h-[44px] items-center gap-2.5', className)}
    >
      <LogoMark />
      <span className="text-[24px] font-semibold tracking-[-0.03em] text-primary">vyom</span>
    </Link>
  );
}
