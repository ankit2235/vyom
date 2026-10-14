import { caseQueue } from '@/content/home';
import { Chip } from '@/components/ui';

/** Sample queue inside the flagship product card. */
export function CaseQueue() {
  return (
    <div className="overflow-hidden rounded-nested border border-line bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2.5 font-mono text-[11px] tracking-[0.1em] text-meta">
        <span>{caseQueue.label}</span>
        <span>SAMPLE DATA</span>
      </div>
      {caseQueue.rows.map((row, index) => (
        <div
          key={row.id}
          className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 ${
            index < caseQueue.rows.length - 1 ? 'border-b border-hairline' : ''
          }`}
        >
          <span className="flex-[0_0_116px] font-mono text-[12.5px] text-primary">{row.id}</span>
          <span className="min-w-0 flex-[1_1_160px] text-[14px] text-muted">{row.detail}</span>
          <Chip tone={row.tone === 'amber' ? 'amber' : 'accent'}>{row.status}</Chip>
        </div>
      ))}
    </div>
  );
}
