import { hero } from '@/content/home';
import { ArrowRightIcon } from '@/components/icons';
import { CaseRunPanel } from '@/components/mocks';
import { StarfieldBackground } from '@/components/site';
import { ButtonLink, Container } from '@/components/ui';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-hairline">
      <StarfieldBackground variant="hero" />
      <Container className="relative flex flex-wrap items-center gap-14 pt-16 pb-16 sm:pt-24 sm:pb-[104px]">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-7">
          <div>
            <span className="inline-flex items-center gap-[9px] rounded-full border border-strong bg-surface px-3 py-1.5 font-mono text-[12px] font-medium tracking-[0.08em] text-secondary">
              <span className="size-1.5 rounded-full bg-accent" />
              {hero.pill}
            </span>
          </div>

          <h1 className="m-0 text-[clamp(44px,5.4vw,74px)] leading-none font-semibold tracking-[-0.035em] text-primary">
            {hero.headline.map((line, index) => (
              <span key={line} className={index === 2 ? 'block text-accent' : 'block'}>
                {line}
              </span>
            ))}
          </h1>

          <p className="m-0 max-w-[540px] text-[19px] leading-[1.6] text-pretty text-muted">
            {hero.lead}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
              <ArrowRightIcon />
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary" size="lg">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          <p className="m-0 font-mono text-[12.5px] leading-[1.6] tracking-[0.02em] text-meta">
            {hero.footnote}
          </p>
        </div>

        <div className="min-w-0 flex-[1_1_520px]">
          <CaseRunPanel />
        </div>
      </Container>
    </section>
  );
}
