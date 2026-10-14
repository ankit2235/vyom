import type { Role, TenantConfig } from '@/lib/tenant/types';

/** Sample tenants only. Real hospital names are not used on this site. */
export const sampleTenants = [
  {
    slug: 'demo-hospital',
    displayName: 'Demo hospital',
    kind: 'Hospital',
    schemes: [
      { id: 'rghs', name: 'RGHS' },
      { id: 'tpa-generic', name: 'TPA (generic)' },
    ],
  },
  {
    slug: 'demo-tpa',
    displayName: 'Demo TPA',
    kind: 'TPA',
    schemes: [{ id: 'tpa-generic', name: 'TPA (generic)' }],
  },
] as const;

export const defaultTenantSlug = sampleTenants[0].slug;

const permissionsByRole: Record<Role, readonly string[]> = {
  executive: ['dashboard.read', 'console.read'],
  operator: ['dashboard.read', 'console.review'],
  hospital_admin: ['dashboard.read', 'settings.write'],
  internal_auditor: ['ops.read', 'dashboard.read', 'console.read'],
};

export function getTenantConfig(slug: string, role: Role = 'operator'): TenantConfig | null {
  const tenant = sampleTenants.find((item) => item.slug === slug);
  if (!tenant) return null;

  return {
    slug: tenant.slug,
    displayName: tenant.displayName,
    kind: tenant.kind,
    fictional: true,
    schemes: tenant.schemes,
    role,
    permissions: permissionsByRole[role],
  };
}
