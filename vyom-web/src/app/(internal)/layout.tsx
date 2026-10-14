import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/site';
import { SampleDataChip } from '@/components/ui';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function InternalLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-8">
        <Logo />
        <div className="flex items-center gap-4">
          <SampleDataChip />
          <Link href="/" className="text-[14px] font-medium text-secondary hover:text-primary">
            Public site
          </Link>
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </div>
  );
}
