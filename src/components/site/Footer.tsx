import Link from 'next/link';
import { siteConfig } from '~/site.config';
import { footer } from '@/content/site';
import { Container } from '@/components/ui';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-page">
      <Container className="flex flex-col gap-12 pt-16 pb-9">
        <div className="flex flex-wrap justify-between gap-x-16 gap-y-10">
          <div className="flex min-w-0 max-w-[360px] flex-[1_1_280px] flex-col gap-3.5">
            <Logo />
            <p className="m-0 text-[15.5px] leading-[1.6] text-muted">{footer.tagline}</p>
            <span className="font-mono text-[11.5px] tracking-[0.12em] text-meta">
              {siteConfig.locationMono}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-[72px] gap-y-8">
            {footer.columns.map((column) => (
              <nav
                key={column.title}
                aria-label={column.title.charAt(0) + column.title.slice(1).toLowerCase()}
                className="flex min-w-[140px] flex-col"
              >
                <span className="pb-1.5 font-mono text-[11.5px] font-medium tracking-[0.12em] text-meta">
                  {column.title}
                </span>
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex min-h-[44px] items-center text-[15px] text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-x-6 gap-y-2.5 border-t border-hairline pt-6 font-mono text-[12px] tracking-[0.04em] text-meta">
          <span>{footer.copyright}</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
            {footer.legal.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-secondary">
                {link.label}
              </Link>
            ))}
            <span>{footer.meaning}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
