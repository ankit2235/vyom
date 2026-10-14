import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { loginPage } from '@/content/auth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Logo } from '@/components/site';
import { Eyebrow } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to the Vyom workspace for your hospital or TPA tenant.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center px-5 py-16">
      <div className="flex w-full max-w-[440px] flex-col gap-8">
        <Logo />
        <div className="flex flex-col gap-4">
          <Eyebrow>{loginPage.eyebrow}</Eyebrow>
          <h1 className="m-0 text-[32px] leading-[1.1] font-semibold tracking-[-0.03em] text-primary">
            {loginPage.heading}
          </h1>
          <p className="m-0 text-[16px] leading-[1.6] text-muted">{loginPage.lead}</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="m-0 text-[13.5px] leading-[1.55] text-meta">{loginPage.notice}</p>
        <Link href="/" className="text-[15px] font-medium text-accent">
          {loginPage.home}
        </Link>
      </div>
    </main>
  );
}
