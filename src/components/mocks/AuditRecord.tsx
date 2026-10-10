import { platformPage } from '@/content/platform';
import { SampleDataChip } from '@/components/ui';

const { auditTrail } = platformPage;

/**
 * One decision, as the audit trail stores it. Sample data: the case and the
 * reviewer are fictional.
 */
export function AuditRecord() {
  return (
    <div className="overflow-hidden rounded-panel border border-strong bg-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-header px-[22px] py-3.5">
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
          {auditTrail.recordLabel}
        </span>
        <SampleDataChip />
      </div>
      <dl className="m-0 flex flex-col p-[22px] font-mono text-[12.5px] leading-[1.9]">
        {auditTrail.record.map((line) => (
          <div key={line.key} className="flex flex-wrap gap-x-3">
            <dt className="w-[150px] shrink-0 text-meta">{line.key}</dt>
            <dd className="m-0 min-w-0 flex-1 break-words text-secondary">{line.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
