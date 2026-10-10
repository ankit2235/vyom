import { caseRun } from '@/content/home';
import {
  DashedCircleIcon,
  HalfCircleIcon,
  StepCheckIcon,
} from '@/components/icons';
import { Button, Chip, SampleDataChip } from '@/components/ui';
import { cn } from '@/lib/cn';

/**
 * The hero panel: one case moving through the pipeline.
 *
 * The steps appear in sequence once, via CSS (see `.case-step`), so this stays
 * a server component and nothing animates on a loop.
 */
export function CaseRunPanel() {
  return (
    <div className="overflow-hidden rounded-panel border border-strong bg-panel shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-line bg-panel-header px-[18px] py-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="size-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_var(--color-accent-tint)]" />
          <span className="text-[14px] font-semibold text-primary">{caseRun.title}</span>
          <span className="font-mono text-[12.5px] text-muted">{caseRun.caseId}</span>
        </div>
        <SampleDataChip />
      </div>

      <div className="flex flex-wrap gap-2 px-[18px] pt-3.5">
        {caseRun.chips.map((chip) => (
          <Chip key={chip.label} tone={chip.tone === 'amber' ? 'amber' : 'default'}>
            {chip.label}
          </Chip>
        ))}
      </div>

      <div className="mx-[18px] mt-3.5 flex flex-col gap-2.5 rounded-nested border border-line bg-panel-header px-4 py-3.5">
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

      <ol className="m-0 flex list-none flex-col px-[18px] pt-2 pb-1.5">
        {caseRun.steps.map((step, index) => (
          <li
            key={step.name}
            style={{ '--step-index': index } as React.CSSProperties}
            className={cn(
              'case-step flex flex-wrap items-center gap-x-3 gap-y-1 py-[9px]',
              index < caseRun.steps.length - 1 && 'border-b border-hairline',
            )}
          >
            <StepGlyph state={step.state} />
            <span
              className={cn(
                'flex-[0_0_124px] text-[14px] font-semibold',
                step.state === 'waiting'
                  ? 'text-amber'
                  : step.state === 'next'
                    ? 'text-muted'
                    : 'text-primary',
              )}
            >
              {step.name}
            </span>
            <span
              className={cn(
                'min-w-0 flex-[1_1_180px] text-[13.5px]',
                step.state === 'waiting'
                  ? 'text-secondary'
                  : step.state === 'next'
                    ? 'text-meta'
                    : 'text-muted',
              )}
            >
              {step.detail}
            </span>
            <span
              className={cn(
                'font-mono text-[12px]',
                step.state === 'waiting'
                  ? 'font-medium tracking-[0.08em] text-amber'
                  : step.state === 'next'
                    ? 'tracking-[0.08em] text-meta'
                    : 'text-meta',
              )}
            >
              {step.time}
            </span>
          </li>
        ))}
      </ol>

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

/** Blue tick = an agent did it. Amber = a person must decide. Dashed = not yet. */
function StepGlyph({ state }: { readonly state: 'done' | 'waiting' | 'next' }) {
  if (state === 'done') {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-tint text-accent">
        <StepCheckIcon />
      </span>
    );
  }

  if (state === 'waiting') {
    return (
      <span className="flex size-5 shrink-0 items-center justify-center text-amber">
        <HalfCircleIcon />
      </span>
    );
  }

  return (
    <span className="flex size-5 shrink-0 items-center justify-center text-dash">
      <DashedCircleIcon />
    </span>
  );
}
