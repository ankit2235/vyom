'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { loginPage } from '@/content/auth';
import { AUTH_COOKIE, ROLE_COOKIE, TENANT_COOKIE, safeNextPath } from '@/lib/auth/session';
import { defaultTenantSlug } from '@/lib/tenant/catalog';
import { Button } from '@/components/ui';

function setSessionCookies(role: 'operator' | 'internal_auditor') {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  const base = `Path=/; SameSite=Lax; Max-Age=${60 * 60 * 8}${secure}`;
  document.cookie = `${AUTH_COOKIE}=vyom-session-stub; ${base}`;
  document.cookie = `${TENANT_COOKIE}=${defaultTenantSlug}; ${base}`;
  document.cookie = `${ROLE_COOKIE}=${role}; ${base}`;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = safeNextPath(searchParams.get('next')) ?? `/${defaultTenantSlug}/dashboard`;
    const role = next.startsWith('/ops') ? 'internal_auditor' : 'operator';
    setSessionCookies(role);
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11.5px] tracking-[0.1em] text-meta">{loginPage.email.label}</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          placeholder={loginPage.email.placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-[48px] rounded-control border border-button bg-raised px-3.5 text-[15px] text-primary placeholder:text-meta"
        />
      </label>
      <Button type="submit">{loginPage.submit}</Button>
    </form>
  );
}
