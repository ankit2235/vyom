import type { Metadata } from 'next';
import {
  AuditSection,
  CallToAction,
  Comparison,
  Hero,
  HowWeStart,
  Platform,
  Problem,
  ProductSuite,
  Standards,
} from '@/components/home';

export const metadata: Metadata = {
  title: 'Vyom — The AI-native engine for drug safety',
  description:
    'Vyom runs pharmacovigilance with AI agents and qualified safety physicians. Pay per case, not per head, and see the proof on your own data before you commit.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Standards />
      <Problem />
      <ProductSuite />
      <Platform />
      <AuditSection />
      <HowWeStart />
      <Comparison />
      <CallToAction />
    </>
  );
}
