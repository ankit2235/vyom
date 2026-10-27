'use client';

import { useState } from 'react';
import { timelineCopy } from '@/content/intelligence/dashboard';
import type { TimelineEvent, TimelineKind } from '@/content/intelligence/types';
import { cn } from '@/lib/cn';
import { BasisChip } from '../EvidenceChip';
import { SourceRefs } from './shared';

const kinds = Object.keys(timelineCopy.kinds) as TimelineKind[];

/**
 * Reports and regulatory actions in order, filterable by kind. Every event
 * carries its basis and sources; undated events say so instead of guessing.
 */
export function CaseTimeline({
  events,
  order,
}: {
  readonly events: readonly TimelineEvent[];
  readonly order: readonly string[];
}) {
  const [kind, setKind] = useState<TimelineKind | 'all'>('all');
  const shown = kind === 'all' ? events : events.filter((event) => event.kind === kind);
  const options = [
    { value: 'all' as const, label: timelineCopy.all, count: events.length },
    ...kinds.map((k) => ({ value: k, label: timelineCopy.kinds[k], count: events.filter((e) => e.kind === k).length })),
  ].filter((option) => option.count > 0);

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label={timelineCopy.filterLabel} className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={kind === option.value}
            onClick={() => setKind(option.value)}
            className={cn(
              'inline-flex min-h-[40px] items-center gap-2 rounded-control border px-3 text-[13.5px]',
              kind === option.value ? 'border-strong bg-raised text-primary' : 'border-line text-muted hover:border-strong',
            )}
          >
            {option.label}
            <span className="font-mono text-[11px] text-meta">{option.count}</span>
          </button>
        ))}
      </div>

      <ol className="m-0 flex list-none flex-col p-0">
        {shown.map((event, index) => (
          <li key={event.title} className="relative flex gap-4 pb-6 last:pb-0">
            {/* The rail: a hairline joining each event to the next. */}
            {index < shown.length - 1 ? (
              <span aria-hidden="true" className="absolute top-5 bottom-0 left-[5px] w-px bg-line" />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                'relative mt-1.5 size-[11px] shrink-0 rounded-full',
                event.date ? 'bg-secondary' : 'border border-dashed border-muted bg-page',
              )}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-card border border-line bg-panel px-5 py-4">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-[12px] tracking-[0.04em] text-primary">{event.dateLabel}</span>
                <span className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">
                  {timelineCopy.kinds[event.kind]}
                </span>
              </span>
              <span className="text-[15.5px] leading-[1.4] font-semibold text-primary">{event.title}</span>
              {event.detail ? <p className="m-0 text-[14.5px] leading-[1.55] text-muted">{event.detail}</p> : null}
              <span className="mt-1 flex flex-wrap items-center gap-2">
                <BasisChip basis={event.basis} />
                <SourceRefs ids={event.sourceIds} order={order} />
              </span>
            </div>
          </li>
        ))}
      </ol>
      <p className="m-0 text-[13px] leading-[1.5] text-meta">{timelineCopy.note}</p>
    </div>
  );
}
