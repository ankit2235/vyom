export type Role = 'executive' | 'operator' | 'hospital_admin' | 'internal_auditor';

export type SchemeRule = {
  readonly id: string;
  readonly name: string;
};

export type TenantConfig = {
  readonly slug: string;
  readonly displayName: string;
  readonly kind: 'Hospital' | 'TPA';
  readonly fictional: true;
  readonly schemes: readonly SchemeRule[];
  readonly role: Role;
  readonly permissions: readonly string[];
};
