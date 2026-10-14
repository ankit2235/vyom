'use client';

import { usePathname, useRouter } from 'next/navigation';
import { platformShell } from '@/content/platformApp';
import { sampleTenants } from '@/lib/tenant/catalog';
import { useTenant } from '@/lib/tenant/TenantContext';

export function TenantSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const tenant = useTenant();
  const rest = pathname.replace(/^\/[^/]+/, '') || '/dashboard';

  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{platformShell.tenantLabel}</span>
      <select
        value={tenant.slug}
        aria-label={platformShell.tenantLabel}
        onChange={(event) => {
          router.push(`/${event.target.value}${rest}`);
        }}
        className="min-h-[44px] rounded-control border border-button bg-raised px-3 text-[14px] text-primary"
      >
        {sampleTenants.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.displayName} {platformShell.fictional}
          </option>
        ))}
      </select>
    </label>
  );
}
