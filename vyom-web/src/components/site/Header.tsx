import Link from 'next/link';
import { headerActions, primaryNav } from '@/content/site';
import { ButtonLink, Container } from '@/components/ui';
import { Logo } from './Logo';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';

export function Header() {
  const secondaryLinks = primaryNav.filter((link) => link.label !== 'Products');

  return (
    <header className="border-b border-hairline">
      <Container>
        <nav aria-label="Main" className="flex items-center justify-between gap-6 py-3.5">
          <Logo />

          <div className="hidden items-center gap-0.5 lg:flex">
            <MegaMenu />
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[44px] items-center px-3.5 text-[15px] font-medium text-secondary transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href={headerActions.secondary.href}
              className="flex min-h-[44px] items-center px-3.5 text-[15px] font-medium text-secondary transition-colors hover:text-primary"
            >
              {headerActions.secondary.label}
            </Link>
            <ButtonLink href={headerActions.primary.href}>{headerActions.primary.label}</ButtonLink>
          </div>

          <MobileNav />
        </nav>
      </Container>
    </header>
  );
}
