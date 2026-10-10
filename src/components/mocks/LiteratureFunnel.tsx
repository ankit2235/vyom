import { literatureFunnel } from '@/content/home';
import { ProgressBar } from '@/components/ui';

/** One week of screening, narrowing to confirmed cases. Sample data. */
export function LiteratureFunnel() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between gap-2 font-mono text-[11px] tracking-[0.1em] text-meta">
        <span>{literatureFunnel.label}</span>
        <span>SAMPLE DATA</span>
      </div>
      {literatureFunnel.rows.map((row) => (
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
