import { cardCopy, roleLabel } from '@/content/intelligence/dashboard';
import type { IntelRecord } from '@/content/intelligence/types';
import { ArrowRightIcon } from '@/components/icons';
import { ButtonLink } from '@/components/ui';
import { formatDate, publishedRange } from '@/lib/intelligence/records';
import { BasisChip, PublicSourceChip, StatusChip } from './EvidenceChip';
import { SourceLinks } from './SourceLinks';

function Row({ label, children }: { readonly label: string; readonly children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[11px] tracking-[0.1em] text-meta">{label}</dt>
      <dd className="m-0 text-[14px] leading-[1.5] text-secondary">{children}</dd>
    </div>
  );
}

/** One public-source record: what, where, when, who, which batch, and how sure. */
export function CaseCard({ record }: { readonly record: IntelRecord }) {
  const { first, last } = publishedRange(record);
  const published = first === last ? formatDate(first) : `${formatDate(first)} – ${formatDate(last)}`;
  const location = [record.location.city, record.location.state, record.location.country].filter(Boolean).join(', ');
  const companyRoles = (['manufacturer', 'distributor'] as const)
    .map((role) => ({ role, parties: record.parties.filter((p) => p.role === role) }))
    .filter((group) => group.parties.length > 0);
  const batches = record.products.flatMap((p) => p.batches.map((b) => `${b.batch} (${p.name})`));
  const batchNote = record.products.find((p) => p.batchNote)?.batchNote;

  return (
    <article className="flex min-w-0 flex-col gap-5 rounded-panel border border-line bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap gap-2">
        <PublicSourceChip />
        {record.statuses.map((status) => (
          <StatusChip key={status} status={status} />
        ))}
      </div>

      <h3 className="m-0 text-[22px] leading-[1.22] font-semibold tracking-[-0.01em] text-primary">{record.title}</h3>

      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-6 gap-y-4">
        <Row label={cardCopy.product}>
          <span className="flex flex-col gap-1.5">
            {record.products.map((product) => (
              <span key={product.name}>
                <span className="font-semibold text-primary">{product.name}</span> · {product.form}
                <span className="block text-[13px] text-muted">{product.activeIngredients.join(', ')}</span>
              </span>
            ))}
          </span>
        </Row>
        <Row label={cardCopy.location}>
          {location}
          {record.location.note ? <span className="block text-[13px] text-muted">{record.location.note}</span> : null}
        </Row>
        <Row label={cardCopy.eventDate}>{record.eventDate.label}</Row>
        <Row label={cardCopy.published}>{published}</Row>
        {companyRoles.map(({ role, parties }) => (
          <Row key={role} label={roleLabel[role].toUpperCase()}>
            <span className="flex flex-col gap-1.5">
              {parties.map((party) => (
                <span key={party.name} className="flex flex-wrap items-center gap-2">
                  {party.name}
                  <BasisChip basis={party.basis} />
                </span>
              ))}
            </span>
          </Row>
        ))}
        <Row label={cardCopy.batch}>
          {batches.length > 0 ? (
            <span className="font-mono text-[12.5px] text-primary">{batches.join(' · ')}</span>
          ) : (
            <span className="text-muted">{batchNote}</span>
          )}
        </Row>
      </dl>

      <div className="flex flex-col gap-1.5 border-t border-line pt-4">
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{cardCopy.whyItMatters}</span>
        <p className="m-0 text-[14.5px] leading-[1.6] text-muted">{record.whyItMatters}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
            {cardCopy.sources(record.sourceIds.length)}
          </span>
          <SourceLinks ids={record.sourceIds} />
        </div>
        <ButtonLink href={`/intelligence/cases/${record.slug}`} variant="secondary">
          {cardCopy.review}
          <ArrowRightIcon size={16} />
        </ButtonLink>
      </div>
    </article>
  );
}
