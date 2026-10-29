import type { Metadata } from 'next';
import Link from 'next/link';
import { alerts } from '@/content/intelligence/alerts';
import { intelligenceMeta, intelligencePage } from '@/content/intelligence/dashboard';
import { records } from '@/content/intelligence/records';
import { ArrowRightIcon } from '@/components/icons';
import { OverviewTiles } from '@/components/intelligence/OverviewTiles';
import { RecordExplorer } from '@/components/intelligence/RecordExplorer';
import { Container, PageHero } from '@/components/ui';
import { formatDate, lastRead } from '@/lib/intelligence/records';

export const metadata: Metadata = {
  title: intelligenceMeta.title,
  description: intelligenceMeta.description,
};

export default function IntelligencePage() {
  const { banner } = intelligencePage;

  return (
    <>
      <PageHero eyebrow={intelligencePage.eyebrow} heading={intelligencePage.heading} lead={intelligencePage.lead}>
        <div className="flex max-w-[860px] flex-col gap-2 rounded-card border border-strong bg-panel px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="font-mono text-[11.5px] font-medium tracking-[0.1em] text-primary">{banner.label}</span>
            <span className="font-mono text-[11px] tracking-[0.08em] text-meta">
              {banner.lastRead} · {formatDate(lastRead(records)).toUpperCase()}
            </span>
          </div>
          <p className="m-0 text-[14.5px] leading-[1.55] text-muted">{banner.text}</p>
        </div>
      </PageHero>

      <section className="border-b border-hairline bg-alt">
        <Container className="flex flex-col gap-12 py-12 sm:py-16">
          <OverviewTiles records={records} alertCount={alerts.length} />
          <Link
            href={intelligencePage.alertsLink.href}
            className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface px-5 py-4 hover:border-strong"
          >
            <span className="flex flex-col gap-1">
              <span className="text-[17px] font-semibold text-primary">{intelligencePage.alertsLink.label}</span>
              <span className="text-[14px] text-muted">{intelligencePage.alertsLink.note(alerts.length)}</span>
            </span>
            <ArrowRightIcon className="text-secondary" />
          </Link>
          <RecordExplorer records={records} />
        </Container>
      </section>
    </>
  );
}
