import { caseRun, caseRunPills } from '@/content/home';
import { StepCheckIcon } from '@/components/icons';
import { Button, Chip, SampleDataChip } from '@/components/ui';
import { cn } from '@/lib/cn';

/**
 * The hero panel: one adverse-event case moving through the pipeline.
 *
 * The steps appear in sequence once, via CSS (see `.case-step`), so this is a
 * server component and nothing animates on a loop.
 */
export function CaseRunPanel() {
  return (
    <div className="overflow-hidden rounded-panel border border-strong bg-panel shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-header px-[18px] py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="size-2 shrink-0 rounded-full bg-accent" />
          <span className="text-[14px] font-semibold text-primary">{caseRun.title}</span>
          <span className="font-mono text-[12.5px] text-muted">{caseRun.caseId}</span>
        </div>
        <SampleDataChip />
      </div>

      <div className="px-[18px] pt-4">
        <div className="flex flex-wrap gap-2">
          {caseRun.chips.map((chip) => (
            <Chip key={chip.label} tone={chip.tone === 'amber' ? 'amber' : 'default'}>
              {chip.label}
            </Chip>
          ))}
        </div>

        <div className="mt-3.5 flex flex-col gap-2.5 rounded-nested border border-line bg-panel-header px-4 py-3.5">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
            {caseRun.passage.label}
          </span>
          <p className="m-0 text-[15px] leading-[1.8] text-secondary">
            {caseRun.passage.segments.map((segment, index) =>
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
          <span className="text-[12.5px] leading-[1.5] text-meta">{caseRun.passage.note}</span>
        </div>

        <ol className="m-0 flex list-none flex-col pt-2 pb-1.5">
          {caseRunPills.map((step, index) => (
            <li
              key={step.name}
              style={{ '--step-index': index } as React.CSSProperties}
              className={cn(
                'case-step flex flex-wrap items-center gap-x-3 gap-y-1.5 py-[9px]',
                index < caseRunPills.length - 1 && 'border-b border-hairline',
              )}
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-tint text-accent">
                <StepCheckIcon />
              </span>
              <span className="flex-[0_0_124px] text-[14px] font-semibold text-primary">
                {step.name}
              </span>
              <span className="shrink-0 rounded-chip border border-accent-line bg-accent-tint px-1.5 py-0.5 font-mono text-[10.5px] font-medium tracking-[0.04em] text-accent">
                [{step.primitive}]
              </span>
              <span className="min-w-0 flex-[1_1_180px] text-[13px] text-muted">{step.detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-panel-header px-[18px] py-3.5">
        <div className="flex flex-wrap gap-2">
          {caseRun.actions.map((action, index) => (
            <Button key={action} variant={index === 0 ? 'panelPrimary' : 'panel'}>
              {action}
            </Button>
          ))}
        </div>
        <span className="font-mono text-[11.5px] tracking-[0.08em] text-meta">
          {caseRun.actionNote}
        </span>
      </div>
    </div>
  );
}
