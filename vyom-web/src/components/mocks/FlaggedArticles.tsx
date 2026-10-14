import { flaggedArticles } from '@/content/products';
import { Chip, ScrollableTable } from '@/components/ui';

const tones = { accent: 'accent', amber: 'amber', default: 'default' } as const;

/** What one week of screening flagged, and why each item was flagged. */
export function FlaggedArticles() {
  return (
    <div className="overflow-hidden rounded-panel border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-[22px] py-3 font-mono text-[11px] tracking-[0.1em] text-meta">
        <span>{flaggedArticles.label}</span>
        <span>SAMPLE DATA</span>
      </div>
      <ScrollableTable label={`${flaggedArticles.label} (sample data)`}>
        <table className="w-full min-w-[460px] border-collapse text-left">
          <thead>
            <tr>
              {flaggedArticles.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-[22px] py-2.5 font-mono text-[11px] font-medium tracking-[0.1em] text-meta"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flaggedArticles.rows.map((row) => (
              <tr key={row.ref}>
                <th
                  scope="row"
                  className="border-t border-hairline px-[22px] py-3 text-left font-mono text-[12.5px] font-normal text-primary"
                >
                  {row.ref}
                </th>
                <td className="border-t border-hairline px-[22px] py-3 font-mono text-[12.5px] text-muted">
                  {row.molecule}
                </td>
                <td className="border-t border-hairline px-[22px] py-3">
                  <Chip tone={tones[row.tone]}>{row.reason.toUpperCase()}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
}
