'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { products, statusLabel } from '@/content/products';
import { ArrowRightIcon, ChevronDownIcon, productIcons } from '@/components/icons';
import { Chip } from '@/components/ui';

/**
 * The Products mega-menu. Radix handles the roving focus, Escape, and the
 * aria-expanded wiring that this pattern needs to be usable from a keyboard.
 */
export function MegaMenu() {
  return (
    // Radix labels its <nav> "Main" by default, which would duplicate the
    // header landmark it sits inside.
    <NavigationMenu.Root aria-label="Products" className="relative" delayDuration={0}>
      <NavigationMenu.List className="m-0 flex list-none p-0">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="group flex min-h-[44px] cursor-pointer items-center gap-1.5 px-2 text-[14px] font-medium whitespace-nowrap text-secondary xl:px-3.5 xl:text-[15px] transition-colors hover:text-primary data-[state=open]:text-primary">
            Products
            <ChevronDownIcon className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content className="absolute top-full left-0 z-50 pt-3">
            <div className="w-[min(92vw,720px)] rounded-panel border border-strong bg-panel p-3 shadow-panel">
              <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0 sm:grid-cols-2">
                {products.map((product) => {
                  const Icon = productIcons[product.slug];
                  return (
                    <li key={product.slug}>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex items-start gap-3 rounded-nested p-3 transition-colors hover:bg-raised"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-button border border-strong bg-surface text-accent">
                            <Icon size={18} />
                          </span>
                          <span className="flex min-w-0 flex-col gap-1.5">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-[15px] font-semibold text-primary">
                                {product.name}
                              </span>
                              <Chip
                                tone={product.status === 'roadmap' ? 'dashed' : 'accent'}
                                size="xs"
                              >
                                {statusLabel[product.status]}
                              </Chip>
                            </span>
                            <span className="text-[13.5px] leading-[1.5] text-muted">
                              {product.summary}
                            </span>
                          </span>
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-1 border-t border-line pt-1">
                <NavigationMenu.Link asChild>
                  <Link
                    href="/products"
                    className="flex min-h-[44px] items-center gap-2 rounded-nested px-3 text-[14px] font-medium text-accent transition-colors hover:bg-raised"
                  >
                    See all products
                    <ArrowRightIcon size={15} />
                  </Link>
                </NavigationMenu.Link>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
