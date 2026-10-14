import { Footer, Header, NoticeBar } from '@/components/site';
import { Reveal } from '@/components/site/Reveal';

export default function MarketingLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <>
      <NoticeBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Reveal />
    </>
  );
}
