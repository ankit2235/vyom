import { cn } from '@/lib/cn';

/** Mono 12px accent label above a heading. */
export function Eyebrow({
  children,
  className,
}: {
  readonly children: string;
  readonly className?: string;
}) {
  return (
    <span
      className={cn(
        'font-mono text-[12px] font-medium tracking-[0.14em] text-accent uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}
