'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { TenantConfig } from '@/lib/tenant/types';

const TenantContext = createContext<TenantConfig | null>(null);

export function TenantProvider({
  value,
  children,
}: {
  readonly value: TenantConfig;
  readonly children: ReactNode;
}) {
  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantConfig {
  const tenant = useContext(TenantContext);
  if (!tenant) {
    throw new Error('useTenant must be used inside TenantProvider');
  }
  return tenant;
}
