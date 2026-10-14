import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { AppSidebar } from '@/components/platform/AppSidebar';
import { ROLE_COOKIE } from '@/lib/auth/session';
import { getTenantConfig } from '@/lib/tenant/catalog';
import { TenantProvider } from '@/lib/tenant/TenantContext';
import type { Role } from '@/lib/tenant/types';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const roles: readonly Role[] = ['executive', 'operator', 'hospital_admin', 'internal_auditor'];

function asRole(value: string | undefined): Role {
  if (value && (roles as readonly string[]).includes(value)) return value as Role;
  return 'operator';
}

export default async function TenantLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ tenant_slug: string }>;
}) {
  const { tenant_slug: slug } = await params;
  const jar = await cookies();
  const tenant = getTenantConfig(slug, asRole(jar.get(ROLE_COOKIE)?.value));
  if (!tenant) notFound();

  return (
    <TenantProvider value={tenant}>
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <AppSidebar />
        <main id="main" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </TenantProvider>
  );
}
