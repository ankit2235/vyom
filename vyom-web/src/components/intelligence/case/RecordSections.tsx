import { auditCopy, detailCopy, originLabel, roleLabel } from '@/content/intelligence/dashboard';
import { getSource } from '@/content/intelligence/sources';
import type { IntelRecord } from '@/content/intelligence/types';
import { ScrollableTable } from '@/components/ui';
import { formatDate, lastRead, publishedRange } from '@/lib/intelligence/records';
import { BasisChip } from '../EvidenceChip';
import { SourceRefs } from './shared';

const th = 'border-b border-line px-4 py-2.5 font-mono text-[11px] font-normal tracking-[0.1em] text-meta uppercase';
const td = 'border-b border-hairline px-4 py-3';

/** Each product with its batches exactly as published, or a stated gap. */
export function ProductBatches({ record, order }: { readonly record: IntelRecord; readonly order: readonly string[] }) {
  return (
    <div className="flex flex-col gap-3">
      {record.products.map((product) => (
        <div key={product.name} className="flex flex-col gap-3 rounded-card border border-line bg-surface p-5">
          <div className="flex flex-col gap-1">
            <span className="text-[17px] font-semibold text-primary">
              {product.name} <span className="font-normal text-muted">· {product.form}</span>
            </span>
            <span className="text-[14px] text-muted">{product.activeIngredients.join(', ')}</span>
          </div>
          {product.batches.length > 0 ? (
            <ScrollableTable label={`${product.name} batches`}>
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr>
                    {detailCopy.batchHeaders.map((header) => (
                      <th key={header} scope="col" className={th}>
                        {header}
                      </th>
                    ))}
                    <th scope="col" className={th}>
                      {detailCopy.evidenceHeader}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.batches.map((batch) => (
                    <tr key={batch.batch}>
                      <th scope="row" className={`${td} font-mono text-[13px] font-medium text-primary`}>
                        {batch.batch}
                      </th>
                      <td className={`${td} font-mono text-[12.5px] text-secondary`}>{batch.manufactured}</td>
                      <td className={`${td} font-mono text-[12.5px] text-secondary`}>{batch.expires}</td>
                      <td className={`${td} text-[13.5px] text-secondary`}>{batch.finding}</td>
                      <td className={td}>
                        <span className="flex flex-wrap items-center gap-2">
                          <BasisChip basis={batch.basis} />
                          <SourceRefs ids={batch.sourceIds} order={order} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollableTable>
          ) : (
            <p className="m-0 rounded-nested border border-dashed border-dash px-4 py-3 text-[14px] leading-[1.5] text-secondary">
              {product.batchNote}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function EvidenceGaps({ gaps }: { readonly gaps: readonly string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2.5 rounded-card border border-dashed border-dash p-5">
      {gaps.map((gap) => (
        <li key={gap} className="flex gap-2.5 text-[14.5px] leading-[1.5] text-secondary">
          <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-full border border-dashed border-muted" />
          {gap}
        </li>
      ))}
    </ul>
  );
}

export function Organisations({ record, order }: { readonly record: IntelRecord; readonly order: readonly string[] }) {
  return (
    <dl className="m-0 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
      {record.parties.map((party) => (
        <div key={party.name} className="flex flex-col gap-1.5 bg-panel px-5 py-4">
          <dt className="font-mono text-[11px] tracking-[0.1em] text-meta">{roleLabel[party.role].toUpperCase()}</dt>
          <dd className="m-0 flex flex-col gap-1.5">
            <span className="flex flex-wrap items-center gap-2 text-[14.5px] font-semibold text-primary">
              {party.name}
              <BasisChip basis={party.basis} />
            </span>
            {party.place ? <span className="text-[13.5px] text-muted">{party.place}</span> : null}
            {party.note ? <span className="text-[13.5px] leading-[1.5] text-muted">{party.note}</span> : null}
            <SourceRefs ids={party.sourceIds} order={order} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function SourceDocuments({ order }: { readonly order: readonly string[] }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-card border border-line bg-line p-0">
      {order.map((id, index) => {
        const source = getSource(id);
        return (
          <li key={id} id={`source-${index + 1}`} className="flex scroll-mt-24 flex-col gap-1.5 bg-panel px-5 py-4">
            <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
              [{index + 1}] · {source.outlet.toUpperCase()} · {detailCopy.sourceKind[source.kind]}
              {source.format ? ` · ${source.format.toUpperCase()}` : ''}
            </span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] leading-[1.45] font-medium text-primary underline decoration-strong underline-offset-4 hover:decoration-secondary"
            >
              {source.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span className="text-[13px] text-muted">
              {source.byline ? `${source.byline} · ` : ''}
              {formatDate(source.publishedOn)} · {detailCopy.readOn} {formatDate(source.retrievedOn)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Record metadata and its append-only history, corrections included. */
export function AuditTrail({ record }: { readonly record: IntelRecord }) {
  const corrections = record.history.filter((entry) => entry.kind === 'correction').length;

  return (
    <div className="flex flex-col gap-4">
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-px overflow-hidden rounded-card border border-line bg-line">
        {[
          [auditCopy.origin, originLabel[record.origin]],
          [auditCopy.firstPublished, formatDate(publishedRange(record).first)],
          [auditCopy.lastRead, formatDate(lastRead([record]))],
          [auditCopy.corrections, String(corrections)],
        ].map(([term, value]) => (
          <div key={term} className="flex flex-col gap-1 bg-panel px-5 py-3.5">
            <dt className="text-[13px] text-muted">{term}</dt>
            <dd className="m-0 text-[15px] font-semibold text-primary">{value}</dd>
          </div>
        ))}
      </dl>
      <ol className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-card border border-line bg-line p-0">
        {record.history.map((entry) => (
          <li key={entry.kind + entry.change} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 bg-panel px-5 py-3">
            <span className="w-[96px] shrink-0 font-mono text-[12px] text-meta">{formatDate(entry.on)}</span>
            <span className="w-[110px] shrink-0 font-mono text-[11px] tracking-[0.1em] text-secondary">
              {auditCopy.kinds[entry.kind]}
            </span>
            <span className="min-w-0 flex-[1_1_260px] text-[14px] leading-[1.5] text-secondary">{entry.change}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
