import type { ReactNode } from 'react';
import { getSource } from '@/content/intelligence/sources';
import type { Statement } from '@/content/intelligence/types';
import { BasisChip } from '../EvidenceChip';

/** A titled block on the case page. `id` is the anchor the section nav jumps to. */
export function CaseSection({
  id,
  label,
  help,
  children,
}: {
  readonly id: string;
  readonly label: string;
  readonly help?: string;
  readonly children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-label`} className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <h2 id={`${id}-label`} className="m-0 text-[22px] leading-[1.25] font-semibold tracking-[-0.01em] text-primary">
          {label}
        </h2>
        {help ? <p className="m-0 text-[14px] leading-[1.5] text-meta">{help}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** Numbered references into the source documents list. */
export function SourceRefs({ ids, order }: { readonly ids: readonly string[]; readonly order: readonly string[] }) {
  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const n = order.indexOf(id) + 1;
        return (
          <a
            key={id}
            href={`#source-${n}`}
            aria-label={`Source ${n}: ${getSource(id).outlet}`}
            className="inline-flex min-h-[24px] items-center rounded-chip border border-strong px-1.5 font-mono text-[11px] text-secondary hover:border-secondary hover:text-primary"
          >
            [{n}]
          </a>
        );
      })}
    </span>
  );
}

/** Statements with their basis, optional verbatim quote and source references. */
export function StatementList({
  statements,
  order,
  empty,
}: {
  readonly statements: readonly Statement[];
  readonly order: readonly string[];
  readonly empty?: string;
}) {
  if (statements.length === 0) {
    return empty ? (
      <p className="m-0 rounded-card border border-dashed border-dash px-5 py-4 text-[14px] text-muted">{empty}</p>
    ) : null;
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-card border border-line bg-line p-0">
      {statements.map((statement) => (
        <li key={statement.text} className="flex flex-col gap-2 bg-panel px-5 py-4">
          <p className="m-0 text-[15px] leading-[1.55] text-secondary">{statement.text}</p>
          {statement.quote ? (
            <blockquote className="m-0 border-l-2 border-strong pl-3 text-[14px] leading-[1.5] text-muted italic">
              “{statement.quote}”
            </blockquote>
          ) : null}
          <span className="flex flex-wrap items-center gap-2">
            <BasisChip basis={statement.basis} />
            <SourceRefs ids={statement.sourceIds} order={order} />
          </span>
        </li>
      ))}
    </ul>
  );
}
