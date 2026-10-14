import type { Metadata } from 'next';
import { ConsoleWorkbench } from '@/components/platform/ConsoleWorkbench';
import { consolePage } from '@/content/platformApp';
import { Container, Eyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Console',
  robots: { index: false, follow: false },
};

export default function ConsolePage() {
  return (
    <Container className="flex flex-col gap-8 py-10 sm:py-14">
      <div className="flex flex-col gap-3">
        <Eyebrow>{consolePage.title}</Eyebrow>
        <h1 className="m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.03em] text-primary">
          {consolePage.heading}
        </h1>
        <p className="m-0 max-w-[640px] text-[16px] leading-[1.6] text-muted">{consolePage.lead}</p>
      </div>
      <ConsoleWorkbench />
    </Container>
  );
}
