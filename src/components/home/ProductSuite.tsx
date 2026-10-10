import Link from 'next/link';
import { productsSection } from '@/content/home';
import { flagshipProduct, getProduct, statusLabel, suiteProducts } from '@/content/products';
import { ArrowRightIcon, productIcons } from '@/components/icons';
import { CaseQueue, LiteratureFunnel } from '@/components/mocks';
import { Chip, Eyebrow, Section } from '@/components/ui';
import type { Product } from '@/content/products';

const FlagshipIcon = productIcons[flagshipProduct.slug];

export function ProductSuite() {
  const literature = getProduct('literature');
  const os = getProduct('os');
  // Literature sits beside the flagship; the rest share the row below.
  const smallCards = suiteProducts.filter((product) => product.slug !== 'literature');
  const OsIconComponent = productIcons.os;

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

        <div className="flex flex-col gap-4">
          <div data-reveal className="flex flex-wrap gap-4">
            {/* Flagship */}
            <article className="flex min-w-0 flex-[2_1_480px] flex-col gap-[22px] rounded-panel border border-accent-line bg-raised p-[30px]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <IconTile>
                    <FlagshipIcon />
                  </IconTile>
                  <span className="text-[17px] font-semibold text-primary">
                    {flagshipProduct.name}
                  </span>
                </div>
                <Chip tone="accent">FLAGSHIP</Chip>
              </div>

              <div className="flex flex-col gap-2.5">
                <h3 className="m-0 text-[26px] leading-[1.2] font-semibold tracking-[-0.015em] text-balance text-primary">
                  {flagshipProduct.headline}
                </h3>
                <p className="m-0 max-w-[620px] text-[16px] leading-[1.6] text-muted">
                  {flagshipProduct.description}
                </p>
              </div>

              <CaseQueue />
              <ProductChips product={flagshipProduct} />
            </article>

            {/* Literature */}
            <article className="flex min-w-0 flex-[1_1_232px] flex-col gap-[22px] rounded-panel border border-line bg-surface p-[30px]">
              <div className="flex items-center gap-3">
                <IconTile raised>
                  <LiteratureIconComponent />
                </IconTile>
                <span className="text-[17px] font-semibold text-primary">{literature.name}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <h3 className="m-0 text-[22px] leading-[1.22] font-semibold tracking-[-0.01em] text-balance text-primary">
                  {literature.headline}
                </h3>
                <p className="m-0 text-[15.5px] leading-[1.6] text-muted">
                  {literature.description}
                </p>
              </div>
              <LiteratureFunnel />
              <ProductChips product={literature} />
            </article>
          </div>

          {/* Audit, Reports, Signal */}
          <div data-reveal className="flex flex-wrap gap-4">
            {smallCards.map((product) => {
              const Icon = productIcons[product.slug];
              return (
                <article
                  key={product.slug}
                  className="flex min-w-0 flex-[1_1_232px] flex-col gap-[18px] rounded-panel border border-line bg-surface p-7"
                >
                  <div className="flex items-center gap-3">
                    <IconTile raised>
                      <Icon />
                    </IconTile>
                    <span className="text-[17px] font-semibold text-primary">{product.name}</span>
                  </div>
                  <h3 className="m-0 text-[21px] leading-[1.25] font-semibold tracking-[-0.01em] text-balance text-primary">
                    {product.headline}
                  </h3>
                  <p className="m-0 text-[15px] leading-[1.6] text-muted">{product.description}</p>
                  <ProductChips product={product} />
                </article>
              );
            })}
          </div>

          {/* Vyom OS */}
          <article
            data-reveal
            className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 rounded-panel border border-line bg-surface px-[30px] py-7"
          >
            <div className="flex min-w-0 flex-[1_1_520px] items-center gap-[18px]">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-nested border border-strong bg-raised text-accent">
                <OsIconComponent />
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[17px] font-semibold text-primary">{os.name}</span>
                  <Chip tone="dashed" size="sm">
                    {statusLabel[os.status]}
                  </Chip>
                </div>
                <h3 className="m-0 text-[21px] leading-[1.25] font-semibold tracking-[-0.01em] text-primary">
                  {os.headline}
                </h3>
                <p className="m-0 text-[15px] leading-[1.6] text-muted">{os.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <Chip>{os.pricing}</Chip>
              <Link
                href={productsSection.osCta.href}
                className="flex min-h-[44px] items-center gap-2 text-[15px] font-medium text-accent transition-opacity hover:opacity-80"
              >
                {productsSection.osCta.label}
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </Section>
  );
}

const LiteratureIconComponent = productIcons.literature;

function IconTile({
  children,
  raised = false,
}: {
  readonly children: React.ReactNode;
  readonly raised?: boolean;
}) {
  return (
    <span
      className={`flex size-[42px] shrink-0 items-center justify-center rounded-button border border-strong text-accent ${
        raised ? 'bg-raised' : 'bg-surface'
      }`}
    >
      {children}
    </span>
  );
}

function ProductChips({ product }: { readonly product: Product }) {
  return (
    <div className="mt-auto flex flex-wrap gap-2">
      <Chip>{product.pricing}</Chip>
      <Chip tone={product.status === 'roadmap' ? 'dashed' : 'default'}>
        {statusLabel[product.status]}
      </Chip>
    </div>
  );
}
