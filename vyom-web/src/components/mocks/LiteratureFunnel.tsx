import { literatureFunnel } from '@/content/home';
import { ProgressBar } from '@/components/ui';
import type { BarTone } from '@/components/ui/ProgressBar';

type FunnelData = {
  readonly label: string;
  readonly rows: readonly {
    readonly label: string;
    readonly value: string;
    readonly width: number;
    readonly tone: BarTone;
  }[];
};

/**
 * One week of screening, narrowing to confirmed cases. Sample data.
 *
 * Defaults to the home page's four stages; the product page passes a longer
 * set that carries on to the drafts written.
 */
export function LiteratureFunnel({ data = literatureFunnel }: { readonly data?: FunnelData }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between gap-2 font-mono text-[11px] tracking-[0.1em] text-meta">
        <span>{data.label}</span>
        <span>SAMPLE DATA</span>
      </div>
      {data.rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-[5px]">
          <div className="flex justify-between gap-2 text-[13px] text-muted">
            <span>{row.label}</span>
            <span className="font-mono text-primary">{row.value}</span>
          </div>
          <ProgressBar width={row.width} tone={row.tone} />
        </div>
      ))}
    </div>
  );
}
