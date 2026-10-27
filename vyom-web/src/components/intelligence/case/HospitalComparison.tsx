import { comparisonCopy } from '@/content/intelligence/dashboard';
import type { Comparison } from '@/content/intelligence/types';
import { ScrollableTable } from '@/components/ui';
import { SourceRefs } from './shared';

/**
 * Side-by-side evidence across institutions. Gaps are shown as gaps, and the
 * caution note stays above the table: likeness is not a common cause.
 */
export function HospitalComparison({
  comparison,
  order,
}: {
  readonly comparison: Comparison;
  readonly order: readonly string[];
}) {
  const summary = [
    { label: comparisonCopy.similar, items: comparison.similar },
    { label: comparisonCopy.different, items: comparison.different },
    { label: comparisonCopy.missing, items: comparison.missing },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p role="note" className="m-0 rounded-card border border-dashed border-secondary bg-panel px-5 py-3.5 text-[14.5px] leading-[1.55] font-medium text-primary">
        {comparisonCopy.caution}
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-px overflow-hidden rounded-card border border-line bg-line">
        {summary.map((group) => (
          <div key={group.label} className="flex flex-col gap-2 bg-panel px-5 py-4">
            <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{group.label}</span>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {group.items.map((item) => (
                <li key={item} className="text-[13.5px] leading-[1.5] text-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ScrollableTable label={comparisonCopy.rowHeader}>
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="w-[190px] border-b border-line px-4 py-3 font-mono text-[11px] font-normal tracking-[0.1em] text-meta">
                {comparisonCopy.rowHeader}
              </th>
              {comparison.columns.map((column) => (
                <th key={column.label} scope="col" className="border-b border-line px-4 py-3 align-bottom">
                  <span className="block text-[14px] font-semibold text-primary">{column.label}</span>
                  <span className="block text-[12.5px] font-normal text-muted">{column.sub}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.label} className="align-top">
                <th scope="row" className="border-b border-hairline px-4 py-3 text-[13.5px] font-medium text-secondary">
                  {row.label}
                </th>
                {row.cells.map((cell, index) => (
                  <td key={index} className="border-b border-hairline px-4 py-3">
                    <span className="flex flex-col items-start gap-1.5">
                      {cell.state === 'missing' ? (
                        <span className="rounded-chip border border-dashed border-dash px-1.5 py-0.5 font-mono text-[10.5px] tracking-[0.08em] text-muted">
                          {comparisonCopy.notInSources}
                        </span>
                      ) : null}
                      <span className={cell.state === 'missing' ? 'text-[13px] text-muted' : 'text-[13.5px] leading-[1.5] text-secondary'}>
                        {cell.text}
                      </span>
                      {cell.sourceIds.length > 0 ? <SourceRefs ids={cell.sourceIds} order={order} /> : null}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
}
