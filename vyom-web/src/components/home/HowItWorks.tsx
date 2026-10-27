'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { howItWorks } from '@/content/home';
import { CheckIcon } from '@/components/icons';
import { Section, SectionHeading } from '@/components/ui';
import { cn } from '@/lib/cn';

type Tone = (typeof howItWorks.steps)[number]['tone'];

const toneText: Record<Tone, string> = {
  default: 'text-meta',
  accent: 'text-accent',
  amber: 'text-amber',
};

const toneBorder: Record<Tone, string> = {
  default: 'border-strong',
  accent: 'border-accent-line',
  amber: 'border-amber-line',
};

/**
 * Four connected steps as an accessible tab list: click or use the arrow
 * keys to move between steps. The first step renders open on the server, so
 * the section reads correctly before JavaScript loads.
 */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const steps = howItWorks.steps;
  const step = steps[active] ?? steps[0];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = steps.length - 1;
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? (active + 1) % steps.length
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? (active - 1 + steps.length) % steps.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <Section id="how-it-works">
      <div className="flex flex-col gap-14">
        <SectionHeading eyebrow={howItWorks.eyebrow} heading={howItWorks.heading} lead={howItWorks.lead} />

        <div data-reveal className="flex flex-col gap-4">
          <div role="tablist" aria-label={howItWorks.eyebrow} className="flex flex-wrap gap-4">
            {steps.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.title}
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${index}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    'relative flex min-w-0 flex-[1_1_220px] flex-col gap-3 rounded-card border p-6 text-left transition-colors duration-150',
                    selected ? cn('bg-raised', toneBorder[item.tone]) : 'border-line bg-surface hover:border-strong',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className={cn('font-mono text-[12px] font-medium tracking-[0.1em]', toneText[item.tone])}>
                      {item.index}
                    </span>
                    {/* The connector: a hairline that runs toward the next step. */}
                    {index < steps.length - 1 ? (
                      <span aria-hidden="true" className="h-px flex-1 bg-dash" />
                    ) : null}
                  </span>
                  <span className="text-[19px] font-semibold text-primary">{item.title}</span>
                  <span className="text-[15px] leading-[1.6] text-muted">{item.summary}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${active}`}
            className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-px overflow-hidden rounded-card border border-line bg-line"
          >
            <div className="flex flex-col gap-3 bg-alt px-6 py-6">
              <span className="font-mono text-[11.5px] tracking-[0.12em] text-meta">{howItWorks.columns.vyom}</span>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {step.vyom.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[15px] leading-[1.5] text-secondary">
                    <CheckIcon size={16} className={cn('mt-[3px] shrink-0', step.tone === 'accent' ? 'text-accent' : 'text-meta')} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 bg-alt px-6 py-6">
              <span className="font-mono text-[11.5px] tracking-[0.12em] text-amber">{howItWorks.columns.people}</span>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {step.people.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 text-[15px] leading-[1.5] text-secondary">
                    <CheckIcon size={16} className="mt-[3px] shrink-0 text-amber" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 bg-alt px-6 py-6">
              <span className="font-mono text-[11.5px] tracking-[0.12em] text-meta">{howItWorks.columns.record}</span>
              <p className="m-0 text-[15px] leading-[1.5] text-secondary">{step.record}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
