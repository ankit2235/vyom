import { overviewCopy, overviewTiles } from '@/content/intelligence/dashboard';
import type { IntelRecord } from '@/content/intelligence/types';
import { Chip } from '@/components/ui';
import { countFor } from '@/lib/intelligence/records';

/**
 * Eight overview tiles. A number appears only when it is counted from the
 * records loaded on this page; otherwise the tile says its source is not
 * connected. Nothing is estimated.
 */
export function OverviewTiles({
  records,
  alertCount,
}: {
  readonly records: readonly IntelRecord[];
  readonly alertCount: number;
}) {
  return (
    <section aria-labelledby="overview-label" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="overview-label" className="m-0 font-mono text-[11.5px] font-normal tracking-[0.12em] text-meta">
          {overviewCopy.label}
        </h2>
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
          {overviewCopy.countedFrom(records.length, alertCount)}
        </span>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-card border border-line bg-line p-0">
        {overviewTiles.map((tile) => (
          <li key={tile.label} className="flex min-h-[132px] flex-col gap-3 bg-panel px-5 py-5">
            <span className="text-[14px] leading-[1.4] text-secondary">{tile.label}</span>
            {tile.measure ? (
              <span className="mt-auto text-[34px] leading-none font-semibold tracking-[-0.03em] text-primary">
                {countFor(tile.measure, records, alertCount)}
              </span>
            ) : (
              <span className="mt-auto flex flex-col items-start gap-2">
                <Chip tone="dashed" size="xs">
                  {overviewCopy.notConnectedChip}
                </Chip>
                <span className="text-[12.5px] leading-[1.45] text-meta">{tile.notConnected}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
