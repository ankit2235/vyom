'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { platformShell } from '@/content/platformApp';
import { Logo } from '@/components/site';
import { SampleDataChip } from '@/components/ui';
import { useTenant } from '@/lib/tenant/TenantContext';
import { SignOutButton } from './SignOutButton';
import { TenantSwitcher } from './TenantSwitcher';

export function AppSidebar() {
  const tenant = useTenant();
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col gap-8 border-b border-hairline bg-panel p-5 lg:w-[260px] lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <Logo />
        <SampleDataChip />
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-mono text-[11px] tracking-[0.12em] text-meta">{platformShell.productLabel}</span>
        <span className="text-[15px] font-medium text-primary">
          {tenant.displayName} {platformShell.fictional}
        </span>
        <span className="text-[13px] text-muted">{tenant.kind}</span>
      </div>

      <TenantSwitcher />

      <nav aria-label="Workspace" className="flex flex-col gap-1">
        {platformShell.nav.map((item) => {
          const href = `/${tenant.slug}${item.hrefSuffix}`;
          const active = pathname === href || pathname === `${href}/`;
          return (
            <Link
              key={item.hrefSuffix}
              href={href}
              className={
                active
                  ? 'rounded-control bg-accent-tint px-3 py-2.5 text-[15px] font-medium text-accent'
                  : 'rounded-control px-3 py-2.5 text-[15px] font-medium text-secondary hover:bg-raised hover:text-primary'
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <SignOutButton />
      </div>
    </aside>
  );
}
