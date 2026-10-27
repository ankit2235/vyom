import type { Metadata } from 'next';
import Link from 'next/link';
import { alerts } from '@/content/intelligence/alerts';
import { alertsMeta, alertsPage } from '@/content/intelligence/alertsCopy';
import { ArrowRightIcon } from '@/components/icons';
import { AlertList } from '@/components/intelligence/alerts/AlertList';
import { ManualImport } from '@/components/intelligence/alerts/ManualImport';
import { Container, PageHero } from '@/components/ui';
import { formatDate } from '@/lib/intelligence/records';

export const metadata: Metadata = {
  title: alertsMeta.title,
  description: alertsMeta.description,
};

export default function AlertsPage() {
  const { banner } = alertsPage;
  const lastChecked = alerts.map((alert) => alert.retrievedOn).sort().at(-1) ?? '';

  return (
    <>
      <PageHero eyebrow={alertsPage.eyebrow} heading={alertsPage.heading} lead={alertsPage.lead}>
        <Link
          href="/intelligence"
          className="inline-flex min-h-[44px] items-center gap-2 self-start text-[14px] font-medium text-secondary hover:text-primary"
        >
          <ArrowRightIcon size={14} className="rotate-180" />
          {alertsPage.back}
        </Link>
        <div className="flex max-w-[860px] flex-col gap-2 rounded-card border border-strong bg-panel px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span className="font-mono text-[11.5px] font-medium tracking-[0.1em] text-primary">{banner.label}</span>
            <span className="font-mono text-[11px] tracking-[0.08em] text-meta">
              {banner.lastChecked} · {formatDate(lastChecked).toUpperCase()}
            </span>
          </div>
          <p className="m-0 text-[14.5px] leading-[1.55] text-muted">{banner.text}</p>
          <p className="m-0 text-[13.5px] leading-[1.5] text-meta">{banner.newLink}</p>
        </div>
      </PageHero>

      <section className="border-b border-hairline bg-alt">
        <Container className="flex flex-col gap-10 py-12 sm:py-16">
          <p className="m-0 text-[14.5px] font-medium text-primary">{alertsPage.notLinked}</p>
          <AlertList alerts={alerts} />
          <ManualImport />
        </Container>
      </section>
    </>
  );
}
