import type { Metadata } from 'next';
import { termsPage } from '@/content/legal';
import { LegalPage } from '@/components/site';

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'Terms for the Vyom marketing website. Draft, pending legal review.',
};

export default function Terms() {
  return <LegalPage content={termsPage} />;
}
