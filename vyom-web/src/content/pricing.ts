/** /pricing — shapes only. No rupee figures. */

export const pricingPage = {
  eyebrow: 'PRICING',
  heading: 'Pay per case, not per head.',
  lead: 'Pricing is quoted after a parallel run on your own volume and mix. We do not publish a rate card, because a number that is not a sourced fact, a labelled target, or sample data does not belong on this site.',
  shapesHeading: 'How we charge',
  shapes: [
    {
      title: 'Per case',
      body: 'End-to-end case processing, priced per case completed.',
    },
    {
      title: 'Per molecule per month',
      body: 'Literature screening for a molecule, billed monthly.',
    },
    {
      title: 'Per case checked',
      body: 'Audit of an external vendor or internal team, per case reviewed.',
    },
    {
      title: 'Per report',
      body: 'Aggregate and periodic safety reports, priced per report.',
    },
  ],
  note: 'The retrospective benchmark is free. Production pricing is written into the contract with quality targets and service credits. Ask for a quote after the parallel run — see How we start.',
  cta: {
    primary: { label: 'Book a demo', href: '/book-demo' },
    secondary: { label: 'How we start', href: '/how-we-start' },
  },
} as const;
