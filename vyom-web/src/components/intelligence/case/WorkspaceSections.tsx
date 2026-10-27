import {
  batchCopy,
  clinicalCopy,
  distributionCopy,
  reviewCopy,
  supportCopy,
} from '@/content/intelligence/dashboard';
import type { Workspace } from '@/content/intelligence/types';
import { ScrollableTable } from '@/components/ui';
import { LinkStatusChip } from '../EvidenceChip';
import { SourceRefs, StatementList } from './shared';

const number = new Intl.NumberFormat('en-IN');

/** The retrospective "How Vyom could support" panel. Never a claim about the incident itself. */
export function SupportPanel({ support }: { readonly support: Workspace['support'] }) {
  return (
    <div className="flex flex-col gap-5 rounded-panel border border-accent-line bg-raised p-6 sm:p-8">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[12px] font-medium tracking-[0.14em] text-accent">{supportCopy.eyebrow}</span>
        <h2 id="support-label" className="m-0 text-[clamp(24px,2.4vw,30px)] leading-[1.15] font-semibold tracking-[-0.02em] text-primary">
          {supportCopy.heading}
        </h2>
        <p className="m-0 max-w-[760px] text-[16px] leading-[1.6] text-secondary">{supportCopy.lead}</p>
        <p className="m-0 max-w-[760px] rounded-nested border border-dashed border-dash px-4 py-3 text-[14px] leading-[1.5] font-medium text-primary">
          {supportCopy.disclaimer}
        </p>
      </div>
      {/* A table on wide screens; stacked cards with their own labels on phones. */}
      <div role="table" aria-label={supportCopy.heading} className="flex flex-col">
        <div role="row" className="hidden gap-6 border-b border-line px-1 pb-2.5 md:grid md:grid-cols-[150px_1fr_1fr]">
          <span role="columnheader" className="font-mono text-[11px] tracking-[0.1em] text-meta">
            {supportCopy.columns.area}
          </span>
          <span role="columnheader" className="font-mono text-[11px] tracking-[0.1em] text-accent">
            {supportCopy.columns.how}
          </span>
          <span role="columnheader" className="font-mono text-[11px] tracking-[0.1em] text-meta">
            {supportCopy.columns.here}
          </span>
        </div>
        {support.map((row) => (
          <div
            key={row.area}
            role="row"
            className="grid gap-2 border-b border-hairline px-1 py-4 md:grid-cols-[150px_1fr_1fr] md:gap-6"
          >
            <span role="rowheader" className="text-[15px] font-semibold text-primary">
              {row.area}
            </span>
            <span role="cell" className="flex flex-col gap-1 text-[14px] leading-[1.55] text-secondary">
              <span className="font-mono text-[10.5px] tracking-[0.1em] text-accent md:hidden">{supportCopy.columns.how}</span>
              {row.how}
            </span>
            <span role="cell" className="flex flex-col gap-1 text-[14px] leading-[1.55] text-muted">
              <span className="font-mono text-[10.5px] tracking-[0.1em] text-meta md:hidden">{supportCopy.columns.here}</span>
              {row.here}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** One lane per product presentation, so different batches are never merged. */
export function BatchLanes({
  lanes,
  conflict,
  order,
}: {
  readonly lanes: Workspace['batchLanes'];
  readonly conflict?: string;
  readonly order: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4">
        {lanes.map((lane) => (
          <div key={lane.label} className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[17px] font-semibold text-primary">{lane.label}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{batchCopy.batchNumber}</span>
                <span className="rounded-chip border border-dashed border-dash px-1.5 py-0.5 font-mono text-[12px] text-secondary">
                  {lane.batchNumber ?? batchCopy.notPublished}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{batchCopy.known}</span>
              <StatementList statements={lane.facts} order={order} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{batchCopy.unknown}</span>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {lane.unknowns.map((unknown) => (
                  <li key={unknown} className="rounded-chip border border-dashed border-dash px-2 py-1 text-[13px] text-secondary">
                    {unknown}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {conflict ? (
        <div className="flex flex-col gap-1.5 rounded-card border border-dashed border-secondary bg-panel px-5 py-4">
          <span className="font-mono text-[11px] tracking-[0.1em] text-primary">{batchCopy.conflict}</span>
          <p className="m-0 text-[14.5px] leading-[1.55] text-secondary">{conflict}</p>
        </div>
      ) : null}
    </div>
  );
}

/** Each documented movement of product, with a computed quantity check. */
export function DistributionEvidence({
  links,
  check,
  order,
}: {
  readonly links: Workspace['distribution'];
  readonly check?: Workspace['quantityCheck'];
  readonly order: readonly string[];
}) {
  const difference = check ? check.outQty - check.inQty : 0;

  return (
    <div className="flex flex-col gap-4">
      <ScrollableTable label={distributionCopy.tableLabel}>
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr>
              {distributionCopy.headers.map((header) => (
                <th key={header} scope="col" className="border-b border-line px-4 py-2.5 font-mono text-[11px] font-normal tracking-[0.1em] text-meta uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={`${link.from}-${link.to}-${link.quantity ?? ''}`} className="align-top">
                <td className="border-b border-hairline px-4 py-3 text-[14px] text-secondary">{link.from}</td>
                <td className="border-b border-hairline px-4 py-3 text-[14px] text-secondary">{link.to}</td>
                <td className="border-b border-hairline px-4 py-3 text-[14px] text-secondary">
                  {link.item}
                  {link.note ? <span className="mt-1 block text-[13px] leading-[1.5] text-muted">{link.note}</span> : null}
                </td>
                <td className="border-b border-hairline px-4 py-3 font-mono text-[12.5px] text-primary">{link.quantity ?? '—'}</td>
                <td className="border-b border-hairline px-4 py-3">
                  <LinkStatusChip status={link.status} />
                </td>
                <td className="border-b border-hairline px-4 py-3">
                  {link.sourceIds.length > 0 ? (
                    <SourceRefs ids={link.sourceIds} order={order} />
                  ) : (
                    <span className="text-[13px] text-meta">{distributionCopy.noSource}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>

      {check ? (
        <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5">
          <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-primary">
            {check.label}
            <SourceRefs ids={check.sourceIds} order={order} />
          </span>
          <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(160px,100%),1fr))] gap-px overflow-hidden rounded-nested border border-line bg-line">
            {[
              [check.inLabel.toUpperCase(), number.format(check.inQty)],
              [check.outLabel.toUpperCase(), number.format(check.outQty)],
              [distributionCopy.difference, `${difference > 0 ? '+' : ''}${number.format(difference)}`],
            ].map(([term, value]) => (
              <div key={term} className="flex flex-col gap-1.5 bg-panel px-4 py-3.5">
                <dt className="font-mono text-[11px] tracking-[0.1em] text-meta">{term}</dt>
                <dd className="m-0 text-[26px] leading-none font-semibold tracking-[-0.02em] text-primary">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="m-0 text-[14px] leading-[1.55] text-muted">
            {distributionCopy.differenceNote(number.format(difference))}. {check.explanation}
          </p>
        </div>
      ) : null}
      <p className="m-0 text-[13px] leading-[1.5] text-meta">{distributionCopy.rule}</p>
    </div>
  );
}

export function ClinicalChronology({
  clinical,
  order,
}: {
  readonly clinical: Workspace['clinical'];
  readonly order: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 rounded-card border border-dashed border-dash px-5 py-4">
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{clinicalCopy.availability}</span>
        <p className="m-0 text-[14.5px] leading-[1.55] text-secondary">{clinical.availability}</p>
      </div>
      <StatementList statements={clinical.items} order={order} />
    </div>
  );
}

/** Suggested next steps for a person. Amber: these are human decisions. */
export function ReviewSteps({ steps }: { readonly steps: Workspace['reviewSteps'] }) {
  return (
    <div className="flex flex-col gap-4 rounded-card border border-amber-line bg-surface p-5 sm:p-6">
      <span className="font-mono text-[11.5px] tracking-[0.12em] text-amber">{reviewCopy.label}</span>
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3.5 text-[15px] leading-[1.55] text-secondary">
            <span className="w-6 shrink-0 font-mono text-[12.5px] leading-[1.9] text-amber">
              {String(index + 1).padStart(2, '0')}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <p className="m-0 border-t border-line pt-3 text-[13.5px] text-muted">{reviewCopy.note}</p>
    </div>
  );
}
