import { comparison } from '@/content/home';
import { Eyebrow, ScrollableTable, Section } from '@/components/ui';

const cell = 'border-t border-line px-6 py-5 align-top';

/**
 * Categories only — services firms and software platforms. Never a named
 * competitor. The table keeps its own horizontal scroll on narrow screens.
 */
export function Comparison() {
  return (
    <Section id="why" alt>
      <div className="flex flex-col gap-12">
        <div data-reveal className="flex max-w-[760px] flex-col gap-4">
          <Eyebrow>{comparison.eyebrow}</Eyebrow>
          <h2 className="m-0 text-[clamp(32px,3.3vw,46px)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-primary">
            {comparison.heading}
          </h2>
          <p className="m-0 text-[18px] leading-[1.6] text-pretty text-muted">{comparison.lead}</p>
        </div>

        <ScrollableTable
          label={comparison.heading}
          className="rounded-panel border border-line bg-surface"
        >
          <table className="w-full min-w-[760px] border-collapse text-[15px] leading-[1.5]">
            <thead>
              <tr>
                {comparison.columns.map((column, index) => {
                  const isVyom = index === comparison.columns.length - 1;
                  return (
                    <th
                      key={column}
                      scope="col"
                      className={`px-6 py-5 text-left font-mono text-[11.5px] font-medium tracking-[0.1em] ${
                        index === 0
                          ? 'w-[24%] text-meta'
                          : isVyom
                            ? 'w-[26%] bg-accent-tint text-accent'
                            : 'w-[25%] text-muted'
                      }`}
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className={`${cell} text-left font-medium text-primary`}
                  >
                    {row.label}
                  </th>
                  <td className={`${cell} ${'quiet' in row && row.quiet ? 'text-meta' : 'text-muted'}`}>
                    {row.services}
                  </td>
                  <td className={`${cell} ${'quiet' in row && row.quiet ? 'text-meta' : 'text-muted'}`}>
                    {row.software}
                  </td>
                  <td className={`${cell} bg-accent-tint font-medium text-primary`}>{row.vyom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>
      </div>
    </Section>
  );
}
