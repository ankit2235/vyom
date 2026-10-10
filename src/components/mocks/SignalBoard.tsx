import { signalBoard } from '@/content/products';
import { Chip, ScrollableTable } from '@/components/ui';
import { MockPanel } from './MockPanel';

const tones = { accent: 'accent', amber: 'amber', default: 'default' } as const;

/**
 * The bar layer is one SVG stretched to the container width
 * (`preserveAspectRatio="none"`), so x units behave like per-mille of the
 * plot area. Labels stay in HTML rather than inside the SVG: scaled SVG text
 * would be unreadable at 375px and oversized at 1440px.
 */
const PLOT_W = 1000;
const BAR_H = 26;
const GAP = 12;

/** Signals under evaluation, with a PRR chart and the review threshold marked. */
export function SignalBoard() {
  const max = Math.max(...signalBoard.rows.map((row) => row.prr), signalBoard.threshold) * 1.15;
  const chartH = signalBoard.rows.length * BAR_H + (signalBoard.rows.length - 1) * GAP;
  const scale = (value: number) => (value / max) * PLOT_W;
  const thresholdX = scale(signalBoard.threshold);

  return (
    <MockPanel title="Signal board" subtitle="SAMPLE PORTFOLIO · FICTIONAL MOLECULES">
      <ScrollableTable label="Signal board (sample data)">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr>
              {signalBoard.columns.map((column) => (
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
            {signalBoard.rows.map((row) => (
              <tr key={`${row.molecule}-${row.event}`}>
                <th
                  scope="row"
                  className="border-t border-hairline px-[22px] py-3 text-left font-mono text-[12.5px] font-normal text-primary"
                >
                  {row.molecule}
                </th>
                <td className="border-t border-hairline px-[22px] py-3 text-[14px] text-secondary">
                  {row.event}
                </td>
                <td className="border-t border-hairline px-[22px] py-3 font-mono text-[12.5px] text-primary">
                  {row.prr.toFixed(1)}
                </td>
                <td className="border-t border-hairline px-[22px] py-3 font-mono text-[12.5px] text-muted">
                  {row.cases}
                </td>
                <td className="border-t border-hairline px-[22px] py-3">
                  <Chip tone={tones[row.tone]}>{row.status.toUpperCase()}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>

      <div className="flex flex-col gap-4 border-t border-line px-[22px] py-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
            {signalBoard.chartLabel}
          </span>
          <span className="font-mono text-[11px] tracking-[0.1em] text-amber">
            {signalBoard.thresholdLabel}
          </span>
        </div>

        <div className="flex gap-4">
          <ul
            className="m-0 flex shrink-0 list-none flex-col p-0"
            style={{ gap: GAP }}
            aria-hidden="true"
          >
            {signalBoard.rows.map((row) => (
              <li
                key={`${row.molecule}-${row.event}`}
                className="flex items-center gap-2 text-[13px] text-secondary"
                style={{ height: BAR_H }}
              >
                <span className="max-w-[128px] truncate">{row.event}</span>
                <span className="font-mono text-[12.5px] text-primary">{row.prr.toFixed(1)}</span>
              </li>
            ))}
          </ul>

          {/* Decorative: every value is printed in the table above. */}
          <svg
            viewBox={`0 0 ${PLOT_W} ${chartH}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            className="min-w-0 flex-1"
            style={{ height: chartH }}
          >
            {signalBoard.rows.map((row, index) => {
              const y = index * (BAR_H + GAP);
              const over = row.prr >= signalBoard.threshold;
              return (
                <g key={`${row.molecule}-${row.event}`}>
                  <rect x={0} y={y} width={PLOT_W} height={BAR_H} fill="var(--color-hairline)" />
                  <rect
                    x={0}
                    y={y}
                    width={Math.max(scale(row.prr), 2)}
                    height={BAR_H}
                    fill={over ? 'var(--color-amber)' : 'var(--color-accent)'}
                  />
                </g>
              );
            })}

            {/* Dark backing first, so the dashes stay visible over an amber bar. */}
            <line
              x1={thresholdX}
              y1={0}
              x2={thresholdX}
              y2={chartH}
              stroke="var(--color-panel)"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={thresholdX}
              y1={0}
              x2={thresholdX}
              y2={chartH}
              stroke="var(--color-amber)"
              strokeWidth="1"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </MockPanel>
  );
}
