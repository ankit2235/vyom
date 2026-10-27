'use client';

import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';
import { assistantCopy, suggestedQuestions, type Intent } from '@/content/intelligence/assistant';
import type { IntelRecord } from '@/content/intelligence/types';
import { Button, Chip } from '@/components/ui';
import { answer, routeQuestion, type Answer } from '@/lib/intelligence/assistant';
import { cn } from '@/lib/cn';
import { SourceRefs } from './shared';

type Exchange = { readonly question: string; readonly result: Answer };

/**
 * A scripted question panel over one record. Suggested questions and typed
 * questions both route to fixed rules; the panel never generates text.
 */
export function EvidenceAssistant({ record }: { readonly record: IntelRecord }) {
  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [draft, setDraft] = useState('');
  const id = useId();
  const order = record.sourceIds;

  function ask(question: string, intent: Intent = routeQuestion(question)) {
    setExchange({ question, result: answer(intent, record) });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.trim()) ask(draft.trim());
  }

  const verdict = exchange?.result.verdict;

  return (
    <div className="flex flex-col gap-5 rounded-panel border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[12px] font-medium tracking-[0.14em] text-accent">{assistantCopy.eyebrow}</span>
          <Chip tone="dashed" size="xs">
            {assistantCopy.chip}
          </Chip>
        </div>
        <p className="m-0 max-w-[760px] text-[14.5px] leading-[1.55] text-muted">{assistantCopy.lead}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{assistantCopy.suggested}</span>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {suggestedQuestions.map((q) => (
            <li key={q.intent}>
              <button
                type="button"
                aria-pressed={exchange?.question === q.label}
                onClick={() => ask(q.label, q.intent)}
                className={cn(
                  'min-h-[40px] rounded-control border px-3 text-left text-[13.5px]',
                  exchange?.question === q.label
                    ? 'border-accent-line bg-accent-tint text-primary'
                    : 'border-line text-secondary hover:border-strong',
                )}
              >
                {q.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <label htmlFor={`${id}-q`} className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">
          {assistantCopy.inputLabel}
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id={`${id}-q`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={assistantCopy.placeholder}
            className="min-h-[44px] min-w-0 flex-[1_1_260px] rounded-control border border-button bg-panel px-3 text-[14.5px] text-primary placeholder:text-meta"
          />
          <Button type="submit" variant="panel">
            {assistantCopy.ask}
          </Button>
        </div>
      </form>

      <div aria-live="polite">
        {exchange && verdict ? (
          <div className="flex flex-col gap-3 rounded-card border border-line bg-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[14px] text-secondary">
                <span className="mr-2 font-mono text-[11px] tracking-[0.1em] text-meta">{assistantCopy.you}</span>
                {exchange.question}
              </span>
              <Chip tone={verdict === 'answered' ? 'default' : 'dashed'} size="xs">
                {assistantCopy.verdict[verdict]}
              </Chip>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 border-t border-line p-0 pt-3">
              {exchange.result.parts.map((part, index) => (
                <li key={index} className="flex flex-col gap-1.5 text-[14.5px] leading-[1.55] text-secondary">
                  <span>{part.text}</span>
                  {part.sourceIds && part.sourceIds.length > 0 ? <SourceRefs ids={part.sourceIds} order={order} /> : null}
                  {part.alert ? (
                    <Link
                      href={`/intelligence/alerts#${part.alert.id}-row-${part.alert.sNo}`}
                      className="self-start text-[13px] text-secondary underline decoration-strong underline-offset-4 hover:text-primary"
                    >
                      {assistantCopy.alertLink}: {part.alert.title}, row {part.alert.sNo}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
