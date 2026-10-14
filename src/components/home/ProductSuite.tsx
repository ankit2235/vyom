import { productsSection } from '@/content/home';
import { productIcons } from '@/components/icons';
import { Chip, Eyebrow, Section } from '@/components/ui';

export function ProductSuite() {
  return (
    <Section id="products" alt>
      <div className="flex flex-col gap-14">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5"
        >
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
            <Eyebrow>{productsSection.eyebrow}</Eyebrow>
            <h2 className="m-0 text-[clamp(32px,3.3vw,46px)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-primary">
              {productsSection.heading}
            </h2>
          </div>
          <p className="m-0 max-w-[480px] flex-[1_1_360px] text-[18px] leading-[1.6] text-pretty text-muted">
            {productsSection.lead}
          </p>
        </div>

        <div data-reveal className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {productsSection.cards.map((card) => {
            const Icon = productIcons[card.icon];
            return (
              <article
                key={card.name}
                className="flex min-w-0 flex-col gap-[18px] rounded-panel border border-line bg-surface p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-[42px] shrink-0 items-center justify-center rounded-button border border-strong bg-raised text-accent">
                    <Icon />
                  </span>
                  <span className="text-[17px] font-semibold text-primary">{card.name}</span>
                </div>
                <p className="m-0 text-[15px] leading-[1.6] text-muted">{card.description}</p>
                {card.badge && (
                  <div className="mt-auto">
                    <Chip tone={card.badge === 'ROADMAP' ? 'dashed' : 'default'} size="sm">
                      {card.badge}
                    </Chip>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
