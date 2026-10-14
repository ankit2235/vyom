import type { Metadata } from 'next';
import { opsPage } from '@/content/platformApp';
import { Chip, Container, Eyebrow, ScrollableTable } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Ops',
  robots: { index: false, follow: false },
};

export default function OpsPage() {
  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <div className="flex flex-col gap-3">
        <Eyebrow>{opsPage.title}</Eyebrow>
        <h1 className="m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.03em] text-primary">
          {opsPage.heading}
        </h1>
        <p className="m-0 max-w-[640px] text-[16px] leading-[1.6] text-muted">{opsPage.lead}</p>
      </div>

      <ScrollableTable label={opsPage.heading} className="rounded-panel border border-line">
        <table className="w-full min-w-[640px] border-collapse text-left text-[14.5px]">
          <thead>
            <tr className="border-b border-hairline font-mono text-[11px] tracking-[0.1em] text-meta">
              <th className="px-4 py-3 font-medium">Tenant</th>
              <th className="px-4 py-3 font-medium">Case</th>
              <th className="px-4 py-3 font-medium">Band</th>
              <th className="px-4 py-3 font-medium">Waiting</th>
            </tr>
          </thead>
          <tbody>
            {opsPage.rows.map((row) => (
              <tr key={`${row.tenant}-${row.id}`} className="border-b border-hairline last:border-0">
                <td className="px-4 py-3 font-mono text-secondary">{row.tenant}</td>
                <td className="px-4 py-3 font-mono text-primary">{row.id}</td>
                <td className="px-4 py-3">
                  <Chip tone={row.band === 'RED' ? 'amber' : 'accent'} size="sm">
                    {row.band}
                  </Chip>
                </td>
                <td className="px-4 py-3 text-secondary">{row.waiting}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
    </Container>
  );
}
