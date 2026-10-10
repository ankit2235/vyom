import type { Metadata } from 'next';
import { privacyPage } from '@/content/legal';
import { LegalPage } from '@/components/site';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'This website collects nothing: no analytics, no cookies, no third-party form service. Draft, pending legal review.',
};

export default function Privacy() {
  return <LegalPage content={privacyPage} />;
}
