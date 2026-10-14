'use client';

import { useRouter } from 'next/navigation';
import { platformShell } from '@/content/platformApp';
import { AUTH_COOKIE, ROLE_COOKIE, TENANT_COOKIE } from '@/lib/auth/session';
import { Button } from '@/components/ui';

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="panel"
      size="md"
      onClick={() => {
        clearCookie(AUTH_COOKIE);
        clearCookie(TENANT_COOKIE);
        clearCookie(ROLE_COOKIE);
        router.push('/login');
        router.refresh();
      }}
    >
      {platformShell.signOut}
    </Button>
  );
}
