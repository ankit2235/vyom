import type { Metadata } from 'next';
import { pricingPage } from '@/content/pricing';
import { ArrowRightIcon } from '@/components/icons';
import { ButtonLink, Card, PageHero, Section, SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Vyom is priced per unit of work — per case, per molecule, per report. Production rates are quoted after a parallel run on your own data.',
};

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow={pricingPage.eyebrow} heading={pricingPage.heading} lead={pricingPage.lead}>
        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink href={pricingPage.cta.primary.href} size="lg">
            {pricingPage.cta.primary.label}
            <ArrowRightIcon />
          </ButtonLink>
          <ButtonLink href={pricingPage.cta.secondary.href} size="lg" variant="secondary">
            {pricingPage.cta.secondary.label}
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <div className="flex flex-col gap-10">
          <SectionHeading heading={pricingPage.shapesHeading} />
          <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
            {pricingPage.shapes.map((shape) => (
              <Card as="li" key={shape.title} className="flex flex-col gap-3 p-7">
                <h2 className="m-0 text-[20px] font-semibold tracking-[-0.02em] text-primary">
                  {shape.title}
                </h2>
                <p className="m-0 text-[15.5px] leading-[1.6] text-muted">{shape.body}</p>
              </Card>
            ))}
          </ul>
          <p className="m-0 max-w-[720px] text-[15.5px] leading-[1.65] text-secondary">{pricingPage.note}</p>
        </div>
      </Section>
    </>
  );
}
