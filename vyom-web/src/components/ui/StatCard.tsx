import { cn } from '@/lib/cn';

/**
 * A sourced market fact: big value, plain-language label, and the source in
 * small mono text pinned to the bottom. The source is not optional.
 */
export function StatCard({
  value,
  label,
  source,
  className,
}: {
  readonly value: string;
  readonly label: string;
  readonly source: string;
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 rounded-card border border-line bg-surface p-[26px]',
        className,
      )}
    >
      <span className="text-[48px] leading-none font-semibold tracking-[-0.03em] text-primary">
        {value}
      </span>
      <span className="text-[16px] leading-[1.5] text-muted">{label}</span>
      <span className="mt-auto pt-2.5 font-mono text-[11.5px] tracking-[0.08em] text-meta">
        {source}
      </span>
    </div>
  );
}
