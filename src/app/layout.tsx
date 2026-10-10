import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import { siteConfig } from '~/site.config';
import { Footer, Header, NoticeBar } from '@/components/site';
import { Reveal } from '@/components/site/Reveal';
import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Vyom — AI-native pharmacovigilance',
    template: '%s — Vyom',
  },
  description:
    'Vyom runs pharmacovigilance with AI agents and qualified safety physicians. Pay per case, not per head, and see the proof on your own data before you commit.',
  // Stays noindex until site.config.ts flips indexable to true.
  robots: siteConfig.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_IN',
    url: siteConfig.url,
  },
};

export const viewport: Viewport = {
  themeColor: '#070B14',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${instrumentSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-button focus:bg-accent focus:px-4 focus:py-2.5 focus:font-medium focus:text-on-accent"
        >
          Skip to content
        </a>
        <NoticeBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
