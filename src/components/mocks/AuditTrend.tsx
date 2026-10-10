import { auditTrend } from '@/content/products';

const W = 520;
const H = 150;
const PAD_X = 10;
const PAD_TOP = 12;
const PAD_BOTTOM = 26;

/**
 * Six months of findings per 100 cases. Plain SVG, no chart library.
 *
 * The chart is decorative: the same numbers are in the table below it, so the
 * figure is aria-hidden and the data is read from the list instead.
 */
export function AuditTrend() {
  const values = auditTrend.points.map((point) => point.value);
  const max = Math.ceil(Math.max(...values));
  const min = Math.floor(Math.min(...values)) - 1;
  const span = max - min || 1;

  const x = (index: number) =>
    PAD_X + (index * (W - PAD_X * 2)) / Math.max(1, auditTrend.points.length - 1);
  const y = (value: number) => PAD_TOP + ((max - value) / span) * (H - PAD_TOP - PAD_BOTTOM);

  const line = auditTrend.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${y(p.value)}`).join(' ');
  const area = `${line} L${x(auditTrend.points.length - 1)} ${H - PAD_BOTTOM} L${x(0)} ${H - PAD_BOTTOM} Z`;

  return (
    <div className="flex flex-col gap-3 border-t border-line px-[22px] py-5">
      <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{auditTrend.label}</span>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-hidden="true"
        className="h-[150px] w-full"
      >
        <path d={area} fill="var(--color-accent-tint)" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {auditTrend.points.map((point, index) => (
          <circle
            key={point.month}
            cx={x(index)}
            cy={y(point.value)}
            r="3"
            fill="var(--color-panel)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <ol className="m-0 flex list-none justify-between gap-1 p-0">
        {auditTrend.points.map((point) => (
          <li key={point.month} className="flex flex-col items-center gap-0.5">
            <span className="font-mono text-[12px] text-secondary">{point.value}</span>
            <span className="font-mono text-[10.5px] tracking-[0.08em] text-meta">
              {point.month}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
