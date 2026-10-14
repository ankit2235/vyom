'use client';

import { useState, type KeyboardEvent } from 'react';
import { caseRun, caseRunPills, claimRun } from '@/content/home';
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
  const [activeTab, setActiveTab] = useState<'rcm' | 'pv'>('rcm');
  const tabs = [
    { id: 'rcm' as const, label: 'Hospital RCM & Pre-Auth' },
    { id: 'pv' as const, label: 'Pharmacovigilance (ICSR)' },
  ];
  const steps = activeTab === 'rcm' ? claimRun.steps : caseRunPills;

  function handleTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const nextTab = activeTab === 'rcm' ? 'pv' : 'rcm';
    setActiveTab(nextTab);
    document.getElementById(`case-run-tab-${nextTab}`)?.focus();
  }

  return (
    <div className="overflow-hidden rounded-panel border border-strong bg-panel shadow-panel">
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-panel-header px-[18px] py-3.5">
        <div
          role="tablist"
          aria-label="Sample workflow"
          onKeyDown={handleTabKeyDown}
          className="flex min-h-11 min-w-0 flex-[1_1_100%] rounded-button border border-line bg-panel p-1 sm:flex-1"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`case-run-tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls="case-run-panel-content"
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex min-h-10 min-w-0 flex-1 items-center justify-center rounded-[6px] px-2 py-1.5 text-center font-mono text-[10.5px] leading-tight tracking-[0.04em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-[11px]',
                activeTab === tab.id
                  ? 'bg-accent-tint text-accent'
                  : 'text-meta hover:text-secondary',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex w-full justify-end sm:w-auto">
          <SampleDataChip />
        </div>
      </div>

      <div
        id="case-run-panel-content"
        role="tabpanel"
        aria-labelledby={`case-run-tab-${activeTab}`}
        className="px-[18px] pt-4"
      >
        <p className="m-0 font-mono text-[11px] leading-[1.6] tracking-[0.04em] text-meta">
          {activeTab === 'rcm'
            ? claimRun.heading
            : `Case run ${caseRun.caseId} · VY-201 · PHARMACOVIGILANCE`}
        </p>

        {activeTab === 'pv' && (
          <div className="flex flex-wrap gap-2 pt-3">
            {caseRun.chips.map((chip) => (
              <Chip key={chip.label} tone={chip.tone === 'amber' ? 'amber' : 'default'}>
                {chip.label}
              </Chip>
            ))}
          </div>
        )}

        <div className="mt-3.5 flex flex-col gap-2.5 rounded-nested border border-line bg-panel-header px-4 py-3.5">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
            {activeTab === 'rcm' ? claimRun.passageLabel : caseRun.passage.label}
          </span>
          <p className="m-0 text-[15px] leading-[1.8] text-secondary">
            {activeTab === 'rcm' ? (
              <>“{claimRun.passage}”</>
            ) : (
              caseRun.passage.segments.map((segment, index) =>
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
              )
            )}
          </p>
          {activeTab === 'pv' && (
            <span className="text-[12.5px] leading-[1.5] text-meta">{caseRun.passage.note}</span>
          )}
        </div>

        <ol className="m-0 flex list-none flex-col pt-2 pb-1.5">
          {steps.map((step, index) => (
            <li
              key={step.name}
              style={{ '--step-index': index } as React.CSSProperties}
              className={cn(
                'case-step flex flex-wrap items-center gap-x-3 gap-y-1.5 py-[9px]',
                index < steps.length - 1 && 'border-b border-hairline',
              )}
            >
              <StepGlyph state="done" />
              <span className="flex-[0_0_124px] text-[14px] font-semibold text-primary">
                {step.name}
              </span>
              <span className="shrink-0 rounded-chip border border-accent-line bg-accent-tint px-1.5 py-0.5 font-mono text-[10.5px] font-medium tracking-[0.04em] text-accent">
                [{step.primitive}]
              </span>
              <span className="min-w-0 flex-[1_1_180px] text-[13px] text-muted">
                {step.detail}
              </span>
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
          AI PROPOSES · CLINICAL EXPERT DECIDES
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
