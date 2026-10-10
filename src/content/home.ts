/**
 * Home page copy, in the order the design presents it.
 *
 * Every number here is one of three things: a sourced market fact, a labelled
 * target, or sample data shown behind a SAMPLE DATA chip.
 */

export const hero = {
  pill: 'AI-NATIVE PHARMACOVIGILANCE · BUILT IN INDIA',
  /**
   * One sentence that wraps naturally. Split so `highlight` can take the
   * accent colour and the underline without the component hardcoding the
   * phrase — change the wording here and the emphasis follows.
   */
  headline: {
    before: 'The AI-native engine for ',
    highlight: 'drug safety',
    after: '.',
  },
  subline:
    'Every case, every journal, every check, handled by AI agents and signed off by qualified safety physicians. Pay per outcome, and see the proof on your own data before you commit.',
  primaryCta: { label: 'Get a free benchmark', href: '/contact' },
  secondaryCta: { label: 'See how it works', href: '/platform' },
  footnote:
    'Free benchmark: we re-run one quarter of your past cases or literature. No integration needed to start.',
} as const;

/** The headline as one string, for metadata and anywhere plain text is needed. */
export const heroHeadlineText = `${hero.headline.before}${hero.headline.highlight}${hero.headline.after}`;

/** The hero case-run panel. Sample data, fictional identifiers only. */
export const caseRun = {
  title: 'Case run',
  caseId: 'VY-CASE-0412',
  chips: [
    { label: 'SOURCE · LITERATURE', tone: 'default' },
    { label: 'SUSPECT DRUG · VY-201', tone: 'default' },
    { label: 'SERIOUS · DAY 3 OF 15', tone: 'amber' },
  ],
  passage: {
    label: 'SOURCE PASSAGE · JOURNAL ARTICLE',
    /** Segments render as plain text or as an accent/amber highlight. */
    segments: [
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
    note: 'Every extracted field links back to the words it came from.',
  },
  steps: [
    { name: 'Intake', detail: 'Article ingested · no duplicate found', time: '09:02:11', state: 'done' },
    { name: 'Validity', detail: 'Patient, reporter, drug and event identified', time: '09:02:14', state: 'done' },
    { name: 'Coding', detail: 'MedDRA PT Hepatotoxicity · confidence 0.94', time: '09:02:19', state: 'done' },
    { name: 'Seriousness', detail: 'Hospitalisation · unlisted for VY-201', time: '09:02:23', state: 'done' },
    { name: 'Narrative', detail: 'Draft written with 4 cited passages', time: '09:02:41', state: 'done' },
    { name: 'Physician review', detail: 'Waiting · evidence attached', time: 'NOW', state: 'waiting' },
    { name: 'E2B(R3) report', detail: 'Due 24 Oct · 12 days left', time: 'NEXT', state: 'next' },
  ],
  actions: ['Approve', 'Correct', 'Escalate'],
  actionNote: 'AI PROPOSES · PHYSICIAN DECIDES',
} as const;

export const standards = {
  label: 'DESIGNED FOR',
  ariaLabel: 'Standards Vyom is designed for',
  items: [
    'ICH E2B(R3)',
    'MedDRA',
    'WHODrug',
    'EU GVP Module VI',
    'US 21 CFR 314.80',
    'CDSCO · PvPI',
    'CIOMS AI in PV',
    'India DPDP Act',
  ],
} as const;

export const problem = {
  eyebrow: 'THE PROBLEM',
  heading: 'Safety work is growing faster than safety teams.',
  lead: 'Every adverse-event report, every journal and every regulatory deadline still runs on manual effort, and the volume keeps rising.',
  statement:
    'The old answer was more people. Vyom’s answer is AI that does the work, and experts who sign it off.',
  /** Sourced market facts. The source is shown under each. */
  stats: [
    { value: '40–85%', label: 'of drug-safety budgets go to case processing.', source: 'SOURCE · DELOITTE' },
    { value: '10–15%', label: 'growth in case volumes, every year.', source: 'SOURCE · DELOITTE' },
    { value: '1M+', label: 'adverse-event reports reach the US FDA each year.', source: 'SOURCE · US FDA' },
    { value: '47%', label: 'of US generic prescriptions are supplied by India.', source: 'SOURCE · GTRI' },
  ],
} as const;

export const productsSection = {
  eyebrow: 'PRODUCTS',
  heading: 'One safety system. Six products.',
  lead: 'Start with one workflow and add the rest as trust grows. Every product shares the same agents, rules and evidence trail.',
  osCta: { label: 'Talk to us about licensing', href: '/contact' },
} as const;

/** Sample data for the flagship card's queue. */
export const caseQueue = {
  label: 'CASE QUEUE · TODAY',
  rows: [
    { id: 'VY-CASE-0412', detail: 'Literature · serious', status: 'AWAITING PHYSICIAN', tone: 'amber' },
    { id: 'VY-CASE-0415', detail: 'Partner E2B file · non-serious', status: 'READY TO SUBMIT', tone: 'accent' },
    { id: 'VY-CASE-0414', detail: 'Call-centre note · serious', status: 'ESCALATED · LOW CONFIDENCE', tone: 'amber' },
  ],
} as const;

/** Sample data for the literature card's funnel. */
export const literatureFunnel = {
  label: 'ONE WEEK',
  rows: [
    { label: 'Articles retrieved', value: '4,820', width: 100, tone: 'muted' },
    { label: 'Unique after de-duplication', value: '3,910', width: 81, tone: 'muted' },
    { label: 'Flagged by AI for review', value: '212', width: 4.4, tone: 'accent' },
    { label: 'Valid cases confirmed', value: '41', width: 0.9, tone: 'amber' },
  ],
} as const;

export const platformSection = {
  eyebrow: 'PLATFORM',
  heading: 'AI proposes. Rules check. Experts decide.',
  lead: 'Every step leaves evidence. No case is excluded by AI alone until its accuracy on your data meets a threshold your qualified person has approved.',
  steps: [
    { index: '01 · SYSTEM', title: 'Ingest', body: 'Email, PDFs, literature, call-centre notes and partner E2B files, de-duplicated on arrival.', tone: 'default' },
    { index: '02 · AI AGENTS', title: 'Understand', body: 'Agents extract patient, drug, event and seriousness, quoting the exact source passage.', tone: 'accent' },
    { index: '03 · RULES', title: 'Check', body: 'Deterministic rules confirm product, dates and the regulatory clock. Anything uncertain goes to people.', tone: 'default' },
    { index: '04 · EXPERTS', title: 'Decide', body: 'Qualified reviewers accept, correct or escalate, with the evidence side by side.', tone: 'amber' },
    { index: '05 · SYSTEM', title: 'Deliver', body: 'E2B(R3) files, screening logs and reports, each with a complete audit trail.', tone: 'default' },
  ],
  assurances: [
    { icon: 'chart', text: 'Evaluation gate on every model, prompt or rule change' },
    { icon: 'list', text: 'Complete, time-stamped, attributable audit trail' },
    { icon: 'lock', text: 'Isolated, encrypted data for every customer' },
    { icon: 'pin', text: 'Hosted in India, with zero-retention model providers' },
  ],
} as const;

export const auditSection = {
  eyebrow: 'VYOM AUDIT',
  heading: 'Check every case. Whoever processed it.',
  lead: 'Most safety teams quality-check a small sample of their vendor’s work, and inspectors look hard at vendor oversight. Vyom Audit checks every processed case and gives your QA team an inspection-ready evidence pack.',
  bullets: [
    'Works across any service provider or safety database',
    'Checks coding against narrative, seriousness logic, missing fields, duplicates and timelines',
    'Findings within 24 hours of case completion (target)',
  ],
  cta: { label: 'Get a free benchmark', href: '/contact' },
} as const;

/** Sample data. Vendor A is fictional and labelled as such. */
export const vendorScorecard = {
  title: 'Vendor scorecard',
  subtitle: 'VENDOR A (FICTIONAL) · Q3 2026',
  stats: [
    { label: 'CASES CHECKED', value: '2,400', tone: 'default' },
    { label: 'COVERAGE', value: '100%', tone: 'accent' },
    { label: 'FINDINGS', value: '194', tone: 'amber' },
  ],
  findingsLabel: 'FINDINGS BY TYPE · SHARE OF CASES',
  findings: [
    { label: 'Coding does not match narrative', value: '74 · 3.1%', width: 100 },
    { label: 'Missing mandatory fields', value: '58 · 2.4%', width: 78 },
    { label: 'Seriousness or outcome inconsistent', value: '29 · 1.2%', width: 39 },
    { label: 'Duplicates not linked', value: '19 · 0.8%', width: 26 },
    { label: 'Late submissions', value: '14 · 0.6%', width: 19 },
  ],
  exportsLabel: 'EXPORTS',
  exports: 'Corrective-action tracker · Inspection evidence pack',
} as const;

export const howWeStart = {
  eyebrow: 'HOW WE START',
  heading: 'Proof before price.',
  lead: 'See Vyom’s quality on your own data before you commit, and keep the evidence either way.',
  stages: [
    {
      number: '01',
      chip: 'WEEKS 1–2 · FREE',
      title: 'Retrospective benchmark',
      body: 'We re-run one quarter of your past literature or cases and show, item by item, what your current process caught and missed. The report is yours to keep.',
      tone: 'accent',
    },
    {
      number: '02',
      chip: 'WEEKS 3–10',
      title: 'Parallel run',
      body: 'Vyom works alongside your current process for eight weeks, measured against recall, accuracy and turnaround targets you agree up front.',
      tone: 'default',
    },
    {
      number: '03',
      chip: 'WEEK 11 ONWARD',
      title: 'Production',
      body: 'Per-case or per-molecule pricing, with quality targets written into the contract and backed by service credits.',
      tone: 'default',
    },
  ],
  /** Explicitly labelled targets, not claims. */
  targetsLabel: 'WHAT EVERY PILOT MUST PROVE · DESIGN TARGETS',
  targets: [
    { value: '≥ 50%', label: 'lower cost per case than your current process' },
    { value: '≥ baseline', label: 'screening recall versus your current process' },
    { value: '100%', label: 'regulatory submissions on time' },
    { value: '< 48 h', label: 'weekly literature turnaround' },
  ],
} as const;

/** Never names a competitor. Categories only. */
export const comparison = {
  eyebrow: 'WHY VYOM',
  heading: 'Built to replace the people-heavy model.',
  lead: 'Services firms grow by adding people. Software platforms leave the work, and the validation, to you. Vyom delivers the outcome and proves it.',
  columns: ['COMPARE', 'SERVICES FIRMS', 'SOFTWARE PLATFORMS', 'VYOM'],
  rows: [
    {
      label: 'What you pay for',
      services: 'Hours and headcount',
      software: 'Licences, plus your own team',
      vyom: 'Outcomes: per case, per molecule',
    },
    {
      label: 'Who does the work',
      services: 'Vendor staff',
      software: 'Your safety team',
      vyom: 'AI agents, signed off by safety physicians',
    },
    {
      label: 'Quality evidence',
      services: 'Small QC samples',
      software: 'Depends on your team',
      vyom: 'Measured on your own data, every week',
    },
    {
      label: 'Independent audit of any vendor',
      services: 'No',
      software: 'No',
      vyom: 'Yes, on 100% of cases',
      quiet: true,
    },
    {
      label: 'Time to go live',
      services: 'Months',
      software: 'Months',
      vyom: 'Weeks (target)',
    },
  ],
} as const;

export const cta = {
  eyebrow: 'DESIGN PARTNERS',
  heading: 'Become a Vyom design partner.',
  lead: 'We are onboarding a small group of drug-safety teams at generics exporters and mid-sized pharma. Partners get a free retrospective benchmark, early pricing and a direct line into the roadmap.',
  primary: { label: 'Get a free benchmark', href: '/contact' },
  secondary: { label: 'Talk to the founder', href: '/contact' },
} as const;
