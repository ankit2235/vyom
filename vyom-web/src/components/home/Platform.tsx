import Link from 'next/link';
import { platformModules } from '@/content/home';
import { getProduct, statusLabel, type ProductSlug } from '@/content/products';
import { ArrowRightIcon, CheckIcon, moduleIcons } from '@/components/icons';
import { Chip, Section, SectionHeading } from '@/components/ui';
import { cn } from '@/lib/cn';

/** A module's status comes from its product, so the two cannot disagree. */
function moduleStatus(product: ProductSlug | null) {
  const status = product ? getProduct(product).status : 'roadmap';
  return { label: statusLabel[status], tone: status === 'roadmap' ? 'dashed' : 'default' } as const;
}

export function Platform() {
  return (
    <Section id="platform" alt>
      <div className="flex flex-col gap-14">
        <SectionHeading
          eyebrow={platformModules.eyebrow}
          heading={platformModules.heading}
          lead={platformModules.lead}
        />

        <ul
          data-reveal
          className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3"
        >
          {platformModules.modules.map((module) => {
            const Icon = moduleIcons[module.icon];
            const status = moduleStatus(module.product);
            const product = module.product ? getProduct(module.product) : null;

            return (
              <li
                key={module.name}
                className={cn(
                  'flex min-w-0 flex-col gap-[18px] rounded-panel border p-7',
                  module.featured ? 'border-accent-line bg-raised' : 'border-line bg-surface',
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-[42px] shrink-0 items-center justify-center rounded-button border border-strong bg-raised text-accent">
                    <Icon />
                  </span>
                  <h3 className="m-0 text-[17px] leading-[1.3] font-semibold text-primary">{module.name}</h3>
                </div>

                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {module.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[14.5px] leading-[1.5] text-muted">
                      <CheckIcon size={16} className="mt-[3px] shrink-0 text-meta" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <Chip tone={status.tone} size="sm">
                    {status.label}
                  </Chip>
                  {product ? (
                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-medium text-accent hover:underline"
                    >
                      {platformModules.productLinkPrefix} {product.name}
                      <ArrowRightIcon size={14} />
                    </Link>
                  ) : (
                    <Link
                      href={platformModules.intelligenceLink.href}
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-medium text-accent hover:underline"
                    >
                      {platformModules.intelligenceLink.label}
                      <ArrowRightIcon size={14} />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
