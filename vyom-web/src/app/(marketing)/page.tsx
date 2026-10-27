import type { Metadata } from 'next';
import { homeMeta } from '@/content/home';
import {
  CallToAction,
  Hero,
  HowItWorks,
  Platform,
  Problem,
  Standards,
  Trust,
  WhyAiNative,
} from '@/components/home';

export const metadata: Metadata = {
  title: { absolute: homeMeta.title },
  description: homeMeta.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Standards />
      <Problem />
      <Platform />
      <HowItWorks />
      <WhyAiNative />
      <Trust />
      <CallToAction />
    </>
  );
}
