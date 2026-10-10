/** The six products. Shared by the home page suite and the product routes. */

export type ProductSlug = 'cases' | 'literature' | 'audit' | 'reports' | 'signal' | 'os';

export type ProductStatus = 'design-partners' | 'roadmap';

export type Product = {
  readonly slug: ProductSlug;
  readonly name: string;
  /** One line, used in the mega-menu. */
  readonly summary: string;
  /** The headline on the home page card. */
  readonly headline: string;
  /** The card body on the home page. */
  readonly description: string;
  /** Pricing shape, shown as a chip. Never a number. */
  readonly pricing: string;
  readonly status: ProductStatus;
};

/** Which product is given the large card. */
export const flagship: ProductSlug = 'cases';

export const statusLabel: Record<ProductStatus, string> = {
  'design-partners': 'DESIGN PARTNERS NOW',
  roadmap: 'ROADMAP',
};

export const products: readonly Product[] = [
  {
    slug: 'cases',
    name: 'Vyom Cases',
    summary: 'End-to-end case processing, priced per case.',
    headline: 'End-to-end case processing, priced per case.',
    description:
      'Intake, validity, MedDRA coding, seriousness, narrative and E2B(R3) submission, drafted by agents and signed off by safety physicians.',
    pricing: 'PRICED PER CASE',
    status: 'design-partners',
  },
  {
    slug: 'literature',
    name: 'Vyom Literature',
    summary: 'Global and Indian journals screened every week.',
    headline: 'Every molecule, every week, every journal.',
    description:
      'Global and Indian journals screened weekly, with measured recall and case-ready drafts.',
    pricing: 'PER MOLECULE / MONTH',
    status: 'design-partners',
  },
  {
    slug: 'audit',
    name: 'Vyom Audit',
    summary: 'Independent checks on 100% of your cases, whoever processed them.',
    headline: 'Independent checks on 100% of your cases, whoever processed them.',
    description:
      'Coding, seriousness logic, missing fields, duplicates and late submissions, with vendor scorecards your QA team can act on.',
    pricing: 'PER CASE CHECKED',
    status: 'design-partners',
  },
  {
    slug: 'reports',
    name: 'Vyom Reports',
    summary: 'Periodic safety reports drafted from your own data.',
    headline: 'Periodic safety reports, drafted from your data.',
    description:
      'Line listings, cumulative tables and literature summaries assembled for PSURs, PBRERs, DSURs and US periodic reports.',
    pricing: 'PER REPORT',
    status: 'roadmap',
  },
  {
    slug: 'signal',
    name: 'Vyom Signal',
    summary: 'Emerging risks surfaced earlier, with documented decisions.',
    headline: 'Emerging risks, surfaced earlier.',
    description:
      'Cross-case aggregation, disproportionality statistics on your data and public FAERS, and documented signal decisions.',
    pricing: 'SUBSCRIPTION',
    status: 'roadmap',
  },
  {
    slug: 'os',
    name: 'Vyom OS',
    summary: 'The engine behind Vyom, licensed to your own team.',
    headline: 'The engine behind Vyom, licensed to your team.',
    description:
      'Run Vyom’s agents, rules, reviewer console and audit trail inside your own safety operation, or your service provider’s.',
    pricing: 'ANNUAL LICENCE',
    status: 'roadmap',
  },
];

export function getProduct(slug: ProductSlug): Product {
  const product = products.find((candidate) => candidate.slug === slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return product;
}

export const flagshipProduct = getProduct(flagship);

/** Everything except the flagship and Vyom OS, which both get their own layout. */
export const suiteProducts = products.filter(
  (product) => product.slug !== flagship && product.slug !== 'os',
);
