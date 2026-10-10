import type { ProductSlug } from '@/content/products';
import { literatureStages } from '@/content/products';
import {
  ArchitectureDiagram,
  CaseDetailPane,
  CaseQueue,
  FlaggedArticles,
  LiteratureFunnel,
  ReportOutline,
  SignalBoard,
  VendorScorecard,
} from '@/components/mocks';

/**
 * The sample screen for each product. Every one of these carries a
 * SAMPLE DATA chip and uses fictional identifiers only.
 */
export function SampleScreen({ slug }: { readonly slug: ProductSlug }) {
  switch (slug) {
    case 'cases':
      return (
        <div className="flex flex-col gap-4">
          <CaseQueue />
          <CaseDetailPane />
        </div>
      );

    case 'literature':
      return (
        <div className="flex flex-col gap-4">
          <div className="rounded-panel border border-strong bg-panel p-[22px] shadow-panel">
            <LiteratureFunnel data={literatureStages} />
          </div>
          <FlaggedArticles />
        </div>
      );

    case 'audit':
      return <VendorScorecard trend />;

    case 'reports':
      return <ReportOutline />;

    case 'signal':
      return <SignalBoard />;

    case 'os':
      return <ArchitectureDiagram />;
  }
}
