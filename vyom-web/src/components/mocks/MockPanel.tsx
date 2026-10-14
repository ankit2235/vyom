import type { ReactNode } from 'react';
import { SampleDataChip } from '@/components/ui';
import { cn } from '@/lib/cn';

/**
 * The shared chrome for every sample screen: bordered panel, header bar with a
 * title and a SAMPLE DATA chip, optional footer. Having one wrapper is what
 * guarantees no mock can ship without the chip.
 */
export function MockPanel({
  title,
  subtitle,
  footer,
  children,
  className,
  bodyClassName,
}: {
  readonly title: string;
  readonly subtitle?: string;
  readonly footer?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly bodyClassName?: string;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-panel border border-strong bg-panel shadow-panel',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-header px-[22px] py-[18px]">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-semibold text-primary">{title}</span>
          {subtitle ? (
            <span className="font-mono text-[11.5px] tracking-[0.06em] text-meta">{subtitle}</span>
          ) : null}
        </div>
        <SampleDataChip />
      </div>

      <div className={bodyClassName}>{children}</div>

      {footer ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line bg-panel-header px-[22px] py-4">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
