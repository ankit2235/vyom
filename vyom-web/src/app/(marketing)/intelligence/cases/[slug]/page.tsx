import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  caseSections,
  detailCopy,
  emptyBucket,
  intelligencePage,
  scopeCopy,
  statementBuckets,
  type CaseSectionId,
} from '@/content/intelligence/dashboard';
import { getRecord, records } from '@/content/intelligence/records';
import { getSource } from '@/content/intelligence/sources';
import type { Basis, IntelRecord } from '@/content/intelligence/types';
import { ArrowRightIcon } from '@/components/icons';
import { CaseTimeline } from '@/components/intelligence/case/CaseTimeline';
import { EvidenceAssistant } from '@/components/intelligence/case/EvidenceAssistant';
import { ExportReport } from '@/components/intelligence/case/ExportReport';
import { HospitalComparison } from '@/components/intelligence/case/HospitalComparison';
import { InvestigationMap } from '@/components/intelligence/case/InvestigationMap';
import { SupplyChainGraph } from '@/components/intelligence/case/SupplyChainGraph';
import {
  AuditTrail,
  EvidenceGaps,
  Organisations,
  ProductBatches,
  SourceDocuments,
} from '@/components/intelligence/case/RecordSections';
import { CaseSection, StatementList } from '@/components/intelligence/case/shared';
import {
  BatchLanes,
  ClinicalChronology,
  DistributionEvidence,
  ReviewSteps,
  SupportPanel,
} from '@/components/intelligence/case/WorkspaceSections';
import { PublicSourceChip, StatusChip } from '@/components/intelligence/EvidenceChip';
import { Container, Eyebrow } from '@/components/ui';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return records.map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const record = getRecord(slug);
  if (!record) return {};
  return { title: record.title, description: record.summary };
}

function bucket(record: IntelRecord, bases: readonly Basis[]) {
  return record.statements.filter((statement) => bases.includes(statement.basis));
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const record = getRecord(slug);
  if (!record) notFound();

  const order = record.sourceIds;
  const workspace = record.workspace;
  const has: Record<NonNullable<(typeof caseSections)[number]['requires']>, boolean> = {
    workspace: Boolean(workspace),
    timeline: Boolean(record.timeline?.length),
    healthConcerns: Boolean(record.healthConcerns?.length),
    actions: Boolean(record.actions?.length),
  };
  const sections = caseSections.filter((section) => section.requires === null || has[section.requires]);
  const label = (id: CaseSectionId) => caseSections.find((section) => section.id === id)?.label ?? id;
  const mediaOnly = order.every((id) => getSource(id).kind === 'media');

  return (
    <>
      <section className="border-b border-hairline">
        <Container className="flex flex-col gap-6 py-12 sm:py-16">
          <Link
            href="/intelligence"
            className="inline-flex min-h-[44px] items-center gap-2 self-start text-[14px] font-medium text-secondary hover:text-primary"
          >
            <ArrowRightIcon size={14} className="rotate-180" />
            {detailCopy.back}
          </Link>
          <Eyebrow>{intelligencePage.eyebrow}</Eyebrow>
          <div className="flex flex-wrap gap-2">
            <PublicSourceChip />
            {record.statuses.map((status) => (
              <StatusChip key={status} status={status} />
            ))}
          </div>
          <h1 className="m-0 max-w-[920px] text-[clamp(32px,4vw,52px)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance text-primary">
            {record.title}
          </h1>
          <p className="m-0 max-w-[780px] text-[18px] leading-[1.6] text-pretty text-muted">{record.summary}</p>

          {record.statuses.includes('causality-not-established') ? (
            <p
              role="note"
              className="m-0 max-w-[860px] rounded-card border border-dashed border-secondary bg-panel px-5 py-4 text-[15.5px] leading-[1.55] font-medium text-primary"
            >
              {detailCopy.causality}
            </p>
          ) : null}
          <ExportReport record={record} />
        </Container>
      </section>

      <div className="border-b border-hairline bg-alt">
        <Container className="flex flex-col gap-10 py-12 sm:py-16 lg:flex-row lg:items-start">
          {/* Section nav: a scrolling strip on small screens, a sticky list on large ones. */}
          <nav aria-label={detailCopy.nav} className="min-w-0 lg:sticky lg:top-6 lg:w-[220px] lg:shrink-0">
            <span className="mb-3 hidden font-mono text-[11px] tracking-[0.12em] text-meta uppercase lg:block">
              {detailCopy.nav}
            </span>
            <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 pb-1 lg:flex-col lg:overflow-visible">
              {sections.map((section) => (
                <li key={section.id} className="shrink-0">
                  <a
                    href={`#${section.id}`}
                    className="flex min-h-[36px] items-center rounded-control px-3 text-[13.5px] whitespace-nowrap text-muted hover:bg-surface hover:text-primary lg:whitespace-normal"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col gap-14">
            {workspace ? (
              <section id="support" aria-labelledby="support-label" className="scroll-mt-24">
                <SupportPanel support={workspace.support} />
              </section>
            ) : null}

            <CaseSection id="assistant" label={label('assistant')}>
              <EvidenceAssistant record={record} />
            </CaseSection>

            <CaseSection
              id="verified"
              label={label('verified')}
              help={mediaOnly ? statementBuckets.verified.mediaOnly : statementBuckets.verified.help}
            >
              <StatementList statements={bucket(record, statementBuckets.verified.bases)} order={order} empty={emptyBucket} />
            </CaseSection>

            <CaseSection id="reported" label={label('reported')} help={statementBuckets.reported.help}>
              <StatementList statements={bucket(record, statementBuckets.reported.bases)} order={order} empty={emptyBucket} />
            </CaseSection>

            <CaseSection id="unknown" label={label('unknown')} help={statementBuckets.unknown.help}>
              <StatementList statements={bucket(record, statementBuckets.unknown.bases)} order={order} empty={emptyBucket} />
            </CaseSection>

            {record.healthConcerns?.length ? (
              <CaseSection id="health" label={label('health')}>
                <StatementList statements={record.healthConcerns} order={order} />
              </CaseSection>
            ) : null}

            {record.actions?.length ? (
              <CaseSection id="actions" label={label('actions')}>
                <StatementList statements={record.actions} order={order} />
              </CaseSection>
            ) : null}

            {record.timeline?.length ? (
              <CaseSection id="timeline" label={label('timeline')}>
                <CaseTimeline events={record.timeline} order={order} />
              </CaseSection>
            ) : null}

            <CaseSection id="batches" label={label('batches')}>
              {record.scopeNote ? (
                <div role="note" className="flex flex-col gap-1.5 rounded-card border border-dashed border-secondary bg-panel px-5 py-4">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-primary">{scopeCopy.label}</span>
                  <p className="m-0 text-[15px] leading-[1.55] font-medium text-primary">{record.scopeNote}</p>
                </div>
              ) : null}
              <ProductBatches record={record} order={order} />
              {workspace ? (
                <BatchLanes lanes={workspace.batchLanes} conflict={workspace.batchConflict} order={order} />
              ) : null}
            </CaseSection>

            {workspace ? (
              <>
                <CaseSection id="graph" label={label('graph')}>
                  <SupplyChainGraph graph={workspace.graph} order={order} />
                </CaseSection>
                <CaseSection id="distribution" label={label('distribution')}>
                  <DistributionEvidence links={workspace.distribution} check={workspace.quantityCheck} order={order} />
                </CaseSection>
                <CaseSection id="map" label={label('map')}>
                  <InvestigationMap map={workspace.map} order={order} />
                </CaseSection>
                <CaseSection id="comparison" label={label('comparison')}>
                  <HospitalComparison comparison={workspace.comparison} order={order} />
                </CaseSection>
                <CaseSection id="clinical" label={label('clinical')}>
                  <ClinicalChronology clinical={workspace.clinical} order={order} />
                </CaseSection>
              </>
            ) : null}

            <CaseSection id="gaps" label={label('gaps')}>
              <EvidenceGaps gaps={record.gaps} />
            </CaseSection>

            <CaseSection id="organisations" label={label('organisations')}>
              <Organisations record={record} order={order} />
            </CaseSection>

            <CaseSection id="sources" label={label('sources')}>
              <SourceDocuments order={order} />
            </CaseSection>

            {workspace ? (
              <CaseSection id="review" label={label('review')}>
                <ReviewSteps steps={workspace.reviewSteps} />
              </CaseSection>
            ) : null}

            <CaseSection id="audit" label={label('audit')}>
              <AuditTrail record={record} />
            </CaseSection>
          </div>
        </Container>
      </div>
    </>
  );
}
