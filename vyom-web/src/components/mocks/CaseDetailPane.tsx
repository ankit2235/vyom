import { caseDetail } from '@/content/products';
import { Button, Chip, SampleDataChip } from '@/components/ui';
import { cn } from '@/lib/cn';

/** The fields an agent extracted, and the passage each one came from. */
export function CaseDetailPane() {
  return (
    <div className="overflow-hidden rounded-panel border border-strong bg-panel shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-header px-[22px] py-[18px]">
        <div className="flex items-center gap-2.5">
          <span className="size-2 shrink-0 rounded-full bg-amber" />
          <span className="text-[15px] font-semibold text-primary">Case detail</span>
          <span className="font-mono text-[12.5px] text-muted">{caseDetail.caseId}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="amber">{caseDetail.status}</Chip>
          <SampleDataChip />
        </div>
      </div>

      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(190px,100%),1fr))] gap-px bg-line">
        {caseDetail.fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1.5 bg-panel px-[22px] py-4">
            <dt className="font-mono text-[11px] tracking-[0.1em] text-meta">{field.label}</dt>
            <dd className="m-0 flex flex-wrap items-baseline gap-2">
              <span className="text-[15px] text-primary">{field.value}</span>
              <span className="font-mono text-[11.5px] text-accent">{field.confidence}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2.5 border-t border-line px-[22px] py-4">
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
          {caseDetail.passageLabel}
        </span>
        <p className="m-0 text-[15px] leading-[1.8] text-secondary">
          {caseDetail.passage.map((segment, index) =>
            segment.mark ? (
              <mark
                key={index}
                className={cn(
                  'rounded px-1 py-px text-primary',
                  segment.mark === 'accent'
                    ? 'border-b-[1.5px] border-accent bg-accent-tint'
                    : 'border-b-[1.5px] border-amber bg-amber-highlight',
                )}
              >
                {segment.text}
              </mark>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-panel-header px-[22px] py-3.5">
        <div className="flex flex-wrap gap-2">
          {caseDetail.actions.map((action, index) => (
            <Button key={action} variant={index === 0 ? 'panelPrimary' : 'panel'}>
              {action}
            </Button>
          ))}
        </div>
        <span className="font-mono text-[11.5px] tracking-[0.08em] text-meta">
          {caseDetail.note}
        </span>
      </div>
    </div>
  );
}
