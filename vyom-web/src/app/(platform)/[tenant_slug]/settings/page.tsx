import type { Metadata } from 'next';
import { settingsPage } from '@/content/platformApp';
import { Card, Container, Eyebrow, SampleDataChip } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Eyebrow>{settingsPage.title}</Eyebrow>
          <h1 className="m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.03em] text-primary">
            {settingsPage.heading}
          </h1>
          <p className="m-0 max-w-[640px] text-[16px] leading-[1.6] text-muted">{settingsPage.lead}</p>
        </div>
        <SampleDataChip />
      </div>

      <Card className="flex flex-col gap-3 p-6">
        <h2 className="m-0 text-[16px] font-semibold text-primary">{settingsPage.tariffLabel}</h2>
        <pre className="m-0 overflow-x-auto rounded-nested bg-raised p-4 font-mono text-[12.5px] leading-[1.55] text-secondary">
          {settingsPage.tariffSample}
        </pre>
      </Card>

      <Card className="flex flex-col gap-3 p-6">
        <h2 className="m-0 text-[16px] font-semibold text-primary">{settingsPage.webhookLabel}</h2>
        <p className="m-0 font-mono text-[14px] text-amber">{settingsPage.webhookValue}</p>
        <p className="m-0 text-[14px] text-muted">{settingsPage.webhookHelp}</p>
      </Card>
    </Container>
  );
}
