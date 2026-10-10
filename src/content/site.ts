/** Navigation, footer and the sitewide notice. Copy only — no markup. */

export type NavLink = {
  readonly label: string;
  readonly href: string;
};

export const notice = {
  label: 'CONCEPT PREVIEW',
  text: 'Product screens show sample data. Figures marked as targets are goals we will prove in pilots.',
} as const;

export const primaryNav: readonly NavLink[] = [
  { label: 'Products', href: '/products' },
  { label: 'Platform', href: '/platform' },
  { label: 'Vyom Audit', href: '/products/audit' },
  { label: 'How we start', href: '/how-we-start' },
  { label: 'Company', href: '/company' },
];

export const headerActions = {
  secondary: { label: 'Talk to the founder', href: '/contact' },
  primary: { label: 'Get a free benchmark', href: '/contact' },
} as const;

export const footer = {
  tagline: 'AI-native drug safety, built in India for the world.',
  columns: [
    {
      title: 'PRODUCTS',
      links: [
        { label: 'Vyom Cases', href: '/products/cases' },
        { label: 'Vyom Literature', href: '/products/literature' },
        { label: 'Vyom Audit', href: '/products/audit' },
        { label: 'Vyom Reports', href: '/products/reports' },
        { label: 'Vyom Signal', href: '/products/signal' },
        { label: 'Vyom OS', href: '/products/os' },
      ],
    },
    {
      title: 'PLATFORM',
      links: [
        { label: 'How it works', href: '/platform' },
        { label: 'Evaluation', href: '/platform#evaluation' },
        { label: 'Security and data', href: '/platform#security' },
        { label: 'How we start', href: '/how-we-start' },
      ],
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'About Vyom', href: '/company' },
        { label: 'Careers', href: '/company#careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
  copyright: '© 2026 Vyom. Concept preview: product screens show sample data.',
  meaning: 'Vyom (व्योम) is Sanskrit for sky.',
} as const satisfies {
  tagline: string;
  columns: readonly { title: string; links: readonly NavLink[] }[];
  legal: readonly NavLink[];
  copyright: string;
  meaning: string;
};
