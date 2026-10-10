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
  /** Pricing shape, shown as a chip on the home page. Never a number. */
  readonly pricing: string;
  /** Pricing unit, shown in the product page hero. Never a number. */
  readonly pricingUnit: string;
  readonly status: ProductStatus;
  /** What this product exists to fix. One paragraph. */
  readonly problem: string;
  /** What it does. Rendered as a ticked list. */
  readonly capabilities: readonly string[];
  /** Numbered steps, derived from the capabilities above. */
  readonly steps: readonly { readonly title: string; readonly body: string }[];
  /**
   * What each pilot must prove. Every entry is a goal, never a result, and is
   * rendered behind a "Target" label.
   */
  readonly targets: readonly string[];
  /** Who the product is for. */
  readonly audience: readonly string[];
  /** Caption shown above the sample screen. */
  readonly sampleScreenLabel: string;
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
    pricingUnit: 'Per case',
    problem:
      'Case processing is the largest line in most safety budgets, and it is still mostly manual.',
    capabilities: [
      'Intake from email, PDFs, literature, call-centre notes and partner E2B files',
      'Routing of each report to adverse event, product complaint or medical inquiry',
      'Validity check: patient, reporter, suspect drug and event',
      'MedDRA and WHODrug coding suggestions',
      'Seriousness and expectedness support',
      'Narrative drafts with every sentence linked to its source',
      'Regulatory clock tracking',
      'E2B(R3) output',
      'Physician review with highlighted evidence',
    ],
    steps: [
      {
        title: 'Ingest',
        body: 'Email, PDFs, literature, call-centre notes and partner E2B files arrive in one queue and are de-duplicated on the way in.',
      },
      {
        title: 'Route and validate',
        body: 'Each report is routed to adverse event, product complaint or medical inquiry, then checked for patient, reporter, suspect drug and event.',
      },
      {
        title: 'Code and assess',
        body: 'Agents suggest MedDRA and WHODrug coding, and support the seriousness and expectedness assessment.',
      },
      {
        title: 'Draft',
        body: 'A narrative is drafted with every sentence linked to the passage it came from, while the regulatory clock is tracked.',
      },
      {
        title: 'Review and submit',
        body: 'A safety physician approves, corrects or escalates with the evidence beside them. Vyom produces the E2B(R3) output.',
      },
    ],
    targets: [
      'At least 50% lower cost per case',
      '100% on-time submissions',
      'Quality at or above your current process',
    ],
    audience: [
      'Drug-safety teams at generics exporters and mid-sized pharma',
      'Pharmacovigilance service firms',
    ],
    sampleScreenLabel: 'CASE QUEUE AND CASE DETAIL',
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
    pricingUnit: 'Per molecule per month',
    problem:
      'Weekly screening of global and Indian journals for hundreds of molecules is slow and hard to prove complete.',
    capabilities: [
      'Approved search strategies',
      'De-duplication',
      'AI screening for relevance, valid cases and special situations: pregnancy, overdose and misuse',
      'Full-text checks',
      'Case-ready drafts',
      'Weekly screening log',
      'Measured recall reports',
    ],
    steps: [
      {
        title: 'Agree the strategy',
        body: 'Search strategies are written and approved with your team before anything runs.',
      },
      {
        title: 'Retrieve and de-duplicate',
        body: 'Global and Indian journals are retrieved every week, then de-duplicated against what you have already seen.',
      },
      {
        title: 'Screen',
        body: 'AI screens for relevance, valid cases and special situations: pregnancy, overdose and misuse.',
      },
      {
        title: 'Check the full text',
        body: 'Anything flagged goes to a full-text check rather than stopping at the abstract.',
      },
      {
        title: 'Draft and log',
        body: 'Confirmed cases become case-ready drafts, and the week closes with a screening log and a measured recall report.',
      },
    ],
    targets: [
      'Recall at or above your current process',
      'Turnaround under 48 hours',
      'Full audit trail',
    ],
    audience: [
      'Generics exporters with large portfolios',
      'Companies that outsource literature screening today',
    ],
    sampleScreenLabel: 'ONE WEEK OF SCREENING',
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
    pricingUnit: 'Per case checked',
    problem:
      "Most teams check only small samples of their vendor's work, and inspectors look hard at vendor oversight.",
    capabilities: [
      'Vendor-neutral checks on every case',
      'Coding against narrative',
      'Seriousness and outcome logic',
      'Missing mandatory fields',
      'Duplicates',
      'Late submissions',
      'Vendor scorecards',
      'Corrective-action export',
      'Inspection evidence packs',
    ],
    steps: [
      {
        title: 'Connect',
        body: 'Vyom reads completed cases from any service provider or safety database. Nothing about your current setup has to change.',
      },
      {
        title: 'Check every case',
        body: 'Coding against narrative, seriousness and outcome logic, missing mandatory fields, duplicates and late submissions — on all of them, not a sample.',
      },
      {
        title: 'Score',
        body: 'Findings are grouped into a vendor scorecard your QA team can take to a review meeting.',
      },
      {
        title: 'Act',
        body: 'Findings export to a corrective-action tracker so each one can be assigned and closed.',
      },
      {
        title: 'Prove it',
        body: 'The same evidence assembles into an inspection pack showing what was checked and what was done about it.',
      },
    ],
    targets: ['100% coverage instead of samples', 'Findings within 24 hours of case completion'],
    audience: ['Heads of drug safety and quality who oversee outsourced providers'],
    sampleScreenLabel: 'VENDOR SCORECARD AND TREND',
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
    pricingUnit: 'Per report',
    problem:
      'PSURs, PBRERs, DSURs and US periodic reports take weeks of assembly before experts can start writing.',
    capabilities: [
      'Line listings and cumulative tables',
      'Literature and signal summaries',
      'Section drafts citing source data',
      'Author and physician review',
      'Version history',
    ],
    steps: [
      {
        title: 'Pull the data',
        body: 'Line listings and cumulative tables are assembled from your cases for the reporting period.',
      },
      {
        title: 'Summarise',
        body: 'Literature and signal activity for the period is summarised alongside them.',
      },
      {
        title: 'Draft sections',
        body: 'Section drafts are written citing the source data, so every statement can be traced back.',
      },
      {
        title: 'Review',
        body: 'Authors and physicians review and rewrite, with the underlying data one click away.',
      },
      {
        title: 'Version',
        body: 'Every change is kept in version history, so the path from first draft to final report is visible.',
      },
    ],
    targets: ['Report assembly time cut from weeks to days'],
    audience: ['Safety writers and qualified persons for pharmacovigilance'],
    sampleScreenLabel: 'REPORT OUTLINE',
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
    pricingUnit: 'Subscription',
    problem:
      'Signals hide across cases, literature and public databases, and evaluation paperwork is heavy.',
    capabilities: [
      'Cross-case aggregation',
      'Disproportionality statistics on your data and public FAERS',
      'Literature alerts',
      'Evaluation workflow',
      'Decision records',
    ],
    steps: [
      {
        title: 'Aggregate',
        body: 'Cases are aggregated across sources and products rather than read one at a time.',
      },
      {
        title: 'Measure',
        body: 'Disproportionality statistics run on your own data and on public FAERS.',
      },
      {
        title: 'Watch the literature',
        body: 'Literature alerts bring in what the case data alone will not show.',
      },
      {
        title: 'Evaluate',
        body: 'Anything that crosses a threshold enters an evaluation workflow instead of an inbox.',
      },
      {
        title: 'Record the decision',
        body: 'Each evaluation closes with a decision record: what was found, what was decided and why.',
      },
    ],
    targets: ['Emerging risks surfaced earlier than case-by-case review'],
    audience: ['Signal management teams'],
    sampleScreenLabel: 'SIGNAL BOARD',
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
    pricingUnit: 'Annual licence',
    problem:
      'In-house teams and service firms want AI automation without building and validating it themselves.',
    capabilities: [
      'Configurable workflows',
      'Reviewer console',
      'Model gateway',
      'Evaluation harness with gold sets',
      'Full audit trail',
      'Tenant isolation',
      'Connection to existing safety databases via E2B(R3) (planned)',
    ],
    steps: [
      {
        title: 'Configure the workflow',
        body: 'Steps, thresholds and routing are configured to match how your safety operation already works.',
      },
      {
        title: 'Connect the models',
        body: 'The model gateway puts every model call behind one controlled, logged interface.',
      },
      {
        title: 'Give reviewers a console',
        body: 'Your qualified reviewers accept, correct or escalate in the same console Vyom uses.',
      },
      {
        title: 'Hold the quality bar',
        body: 'An evaluation harness runs gold sets against every model, prompt or rule change before it ships.',
      },
      {
        title: 'Operate',
        body: 'A full audit trail and tenant isolation underneath, with connection to existing safety databases via E2B(R3) planned.',
      },
    ],
    targets: ['Automation your team can validate and own, without building the platform'],
    audience: ['In-house safety operations teams', 'Pharmacovigilance service providers'],
    sampleScreenLabel: 'ARCHITECTURE',
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

/* ---------------------------------------------------------------------------
   Capability matrix for /products.

   A tick appears only where that product's own capability list above states it.
   Nothing is inferred, so an empty cell means "not claimed", not "impossible".
   --------------------------------------------------------------------------- */

export type MatrixRow = {
  readonly capability: string;
  readonly products: readonly ProductSlug[];
  /** Rendered as a dashed tick: stated as planned rather than available. */
  readonly planned?: readonly ProductSlug[];
};

export const capabilityMatrix: readonly MatrixRow[] = [
  {
    capability: 'Intake from email, PDFs, literature and partner E2B files',
    products: ['cases'],
  },
  { capability: 'De-duplication', products: ['cases', 'literature', 'audit'] },
  { capability: 'MedDRA and WHODrug coding', products: ['cases', 'audit'] },
  { capability: 'Seriousness and outcome logic', products: ['cases', 'audit'] },
  { capability: 'Drafts that cite their source', products: ['cases', 'reports'] },
  { capability: 'Weekly literature screening', products: ['literature', 'signal'] },
  { capability: 'Regulatory clock and timeliness', products: ['cases', 'audit'] },
  { capability: 'E2B(R3) output or exchange', products: ['cases'], planned: ['os'] },
  { capability: 'Checks cases from any vendor', products: ['audit'] },
  { capability: 'Disproportionality statistics', products: ['signal'] },
  { capability: 'Expert review before anything is final', products: ['cases', 'reports', 'signal', 'os'] },
  { capability: 'Measured quality on your own data', products: ['literature', 'audit', 'os'] },
  {
    capability: 'Audit trail and decision records',
    products: ['literature', 'audit', 'reports', 'signal', 'os'],
  },
];

export const matrixNote =
  'A tick marks a capability the product states today. Products on the roadmap are marked in the header.';

/* ---------------------------------------------------------------------------
   Sample data for the product-page screens. Fictional codes only, and every
   screen that shows these carries a SAMPLE DATA chip.
   --------------------------------------------------------------------------- */

/** Vyom Cases — the detail pane beside the queue. */
export const caseDetail = {
  caseId: 'VY-CASE-0412',
  status: 'AWAITING PHYSICIAN',
  fields: [
    { label: 'PATIENT', value: '54-year-old woman', confidence: '0.98' },
    { label: 'SUSPECT DRUG', value: 'VY-201', confidence: '0.99' },
    { label: 'EVENT', value: 'Elevated liver enzymes', confidence: '0.96' },
    { label: 'MEDDRA PT', value: 'Hepatotoxicity', confidence: '0.94' },
    { label: 'SERIOUSNESS', value: 'Hospitalisation', confidence: '0.97' },
    { label: 'EXPECTEDNESS', value: 'Unlisted for VY-201', confidence: '0.91' },
  ],
  passageLabel: 'SOURCE PASSAGE · JOURNAL ARTICLE',
  passage: [
    { text: '“A ', mark: null },
    { text: '54-year-old woman', mark: 'accent' },
    { text: ' developed ', mark: null },
    { text: 'elevated liver enzymes', mark: 'accent' },
    { text: ' and was ', mark: null },
    { text: 'hospitalised', mark: 'amber' },
    { text: ' two weeks after starting ', mark: null },
    { text: 'VY-201', mark: 'accent' },
    { text: '.”', mark: null },
  ],
  actions: ['Approve', 'Correct', 'Escalate'],
  note: 'AI PROPOSES · PHYSICIAN DECIDES',
} as const;

/** Vyom Literature — the five-stage funnel, one stage longer than the home page. */
export const literatureStages = {
  label: 'ONE WEEK',
  rows: [
    { label: 'Articles retrieved', value: '4,820', width: 100, tone: 'muted' },
    { label: 'Unique after de-duplication', value: '3,910', width: 81, tone: 'muted' },
    { label: 'Flagged by AI for review', value: '212', width: 4.4, tone: 'accent' },
    { label: 'Valid cases confirmed', value: '41', width: 0.9, tone: 'amber' },
    { label: 'Case-ready drafts written', value: '41', width: 0.9, tone: 'amber' },
  ],
} as const;

export const flaggedArticles = {
  label: 'FLAGGED ARTICLES',
  columns: ['REFERENCE', 'MOLECULE', 'REASON'],
  rows: [
    { ref: 'VY-LIT-1184', molecule: 'VY-201', reason: 'Valid case', tone: 'accent' },
    { ref: 'VY-LIT-1190', molecule: 'VY-305', reason: 'Pregnancy', tone: 'amber' },
    { ref: 'VY-LIT-1203', molecule: 'VY-201', reason: 'Overdose', tone: 'amber' },
    { ref: 'VY-LIT-1217', molecule: 'VY-412', reason: 'Valid case', tone: 'accent' },
    { ref: 'VY-LIT-1224', molecule: 'VY-305', reason: 'Not relevant – QC sample', tone: 'default' },
  ],
} as const;

/** Vyom Audit — a six-month error-rate trend beside the scorecard. */
export const auditTrend = {
  label: 'FINDINGS PER 100 CASES · VENDOR A (FICTIONAL)',
  points: [
    { month: 'APR', value: 11.4 },
    { month: 'MAY', value: 10.1 },
    { month: 'JUN', value: 9.6 },
    { month: 'JUL', value: 9.8 },
    { month: 'AUG', value: 8.7 },
    { month: 'SEP', value: 8.1 },
  ],
} as const;

/** Vyom Reports — a periodic report outline with per-section status. */
export const reportOutline = {
  title: 'PBRER · VY-201 · Jan–Jun 2026',
  sections: [
    { number: '1', title: 'Introduction', status: 'Auto-filled', tone: 'accent' },
    { number: '2', title: 'Worldwide marketing authorisation status', status: 'Auto-filled', tone: 'accent' },
    { number: '3', title: 'Actions taken for safety reasons', status: 'Needs input', tone: 'amber' },
    { number: '4', title: 'Changes to reference safety information', status: 'Draft ready', tone: 'accent' },
    { number: '5', title: 'Estimated exposure', status: 'Needs input', tone: 'amber' },
    { number: '6', title: 'Data in summary tabulations', status: 'Draft ready', tone: 'accent' },
    { number: '7', title: 'Summaries of significant findings from literature', status: 'In review', tone: 'amber' },
    { number: '8', title: 'Signal evaluation', status: 'In review', tone: 'amber' },
    { number: '9', title: 'Benefit-risk evaluation', status: 'Physician authoring', tone: 'amber' },
  ],
} as const;

/** Vyom Signal — the board plus the PRR chart. */
export const signalBoard = {
  label: 'SIGNAL BOARD',
  columns: ['MOLECULE', 'EVENT', 'PRR', 'CASES', 'STATUS'],
  rows: [
    { molecule: 'VY-305', event: 'Hyponatraemia', prr: 3.2, cases: 14, status: 'Under evaluation', tone: 'amber' },
    { molecule: 'VY-305', event: 'Rash', prr: 1.1, cases: 40, status: 'No action', tone: 'default' },
    { molecule: 'VY-412', event: 'QT prolongation', prr: 2.4, cases: 6, status: 'Monitoring', tone: 'accent' },
  ],
  chartLabel: 'PRR BY EVENT',
  /** Where the review threshold sits on the chart. */
  threshold: 2.0,
  thresholdLabel: 'REVIEW THRESHOLD · PRR 2.0',
} as const;

/** Vyom OS — the architecture diagram. */
export const architecture = {
  label: 'VYOM OS',
  flow: [
    { title: 'Ingest', tone: 'default' },
    { title: 'Understand', tone: 'accent' },
    { title: 'Check', tone: 'default' },
    { title: 'Decide', tone: 'amber' },
    { title: 'Deliver', tone: 'default' },
  ],
  foundationLabel: 'ON A FOUNDATION OF',
  foundation: [
    { title: 'Evaluation', body: 'Gold sets gate every change' },
    { title: 'Audit trail', body: 'Time-stamped and attributable' },
    { title: 'Model gateway', body: 'One controlled interface' },
    { title: 'Tenant isolation', body: 'Separate, encrypted per customer' },
  ],
} as const;

/* ---------------------------------------------------------------------------
   Navigation between product pages
   --------------------------------------------------------------------------- */

export type ProductNeighbours = {
  readonly previous: Product | null;
  readonly next: Product | null;
};

/** The previous and next product in `products` order. The list does not wrap. */
export function getProductNeighbours(slug: ProductSlug): ProductNeighbours {
  const index = products.findIndex((product) => product.slug === slug);
  return {
    previous: index > 0 ? (products[index - 1] ?? null) : null,
    next: index < products.length - 1 ? (products[index + 1] ?? null) : null,
  };
}
