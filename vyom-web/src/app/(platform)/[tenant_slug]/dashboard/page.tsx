import type { Metadata } from 'next';
import { dashboardPage } from '@/content/platformApp';
import { Card, Chip, Container, Eyebrow, SampleDataChip, ScrollableTable } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <Container className="flex flex-col gap-10 py-10 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Eyebrow>{dashboardPage.title}</Eyebrow>
          <h1 className="m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.03em] text-primary">
            {dashboardPage.heading}
          </h1>
          <p className="m-0 max-w-[640px] text-[16px] leading-[1.6] text-muted">{dashboardPage.lead}</p>
        </div>
        <SampleDataChip />
      </div>

      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardPage.metrics.map((metric) => (
          <Card as="li" key={metric.label} className="flex flex-col gap-2 p-6">
            <span className="text-[36px] leading-none font-semibold tracking-[-0.03em] text-primary">
              {metric.value}
            </span>
            <span className="text-[15px] leading-[1.45] text-secondary">{metric.label}</span>
            <span className="font-mono text-[11px] tracking-[0.08em] text-meta">{metric.hint}</span>
          </Card>
        ))}
      </ul>

      <section className="flex flex-col gap-4">
        <h2 className="m-0 text-[20px] font-semibold text-primary">{dashboardPage.queueHeading}</h2>
        <ScrollableTable label={dashboardPage.queueHeading} className="rounded-panel border border-line">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14.5px]">
            <thead>
              <tr className="border-b border-hairline font-mono text-[11px] tracking-[0.1em] text-meta">
                <th className="px-4 py-3 font-medium">Case</th>
                <th className="px-4 py-3 font-medium">Scheme</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Band</th>
              </tr>
            </thead>
            <tbody>
              {dashboardPage.queue.map((row) => (
                <tr key={row.id} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3 font-mono text-primary">{row.id}</td>
                  <td className="px-4 py-3 text-secondary">{row.scheme}</td>
                  <td className="px-4 py-3 text-secondary">{row.age}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.band === 'RED' ? 'amber' : 'accent'} size="sm">
                      {row.band}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>
      </section>
    </Container>
  );
}
