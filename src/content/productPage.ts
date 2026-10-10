/** Shared chrome for the product template. Per-product copy lives in products.ts. */

export const productPage = {
  pricingLabel: 'PRICING',
  cta: {
    href: '/contact',
    label: 'Get a free benchmark',
    /** Roadmap products cannot be benchmarked yet, so they ask differently. */
    roadmapLabel: 'Talk to us about this',
  },

  problemEyebrow: 'THE PROBLEM',

  capabilitiesEyebrow: 'CAPABILITIES',
  capabilitiesHeading: 'What it does.',

  stepsEyebrow: 'HOW IT WORKS',
  stepsHeading: 'Five steps, every time.',

  sampleEyebrow: 'SAMPLE SCREEN',
  sampleHeading: 'What you would be looking at.',
  sampleLead:
    'A concept screen built with sample data and fictional drug codes, to show the shape of the work rather than any real customer’s.',

  targetsEyebrow: 'TARGETS',
  targetsHeading: 'What a pilot has to prove.',
  targetsLead:
    'These are goals we commit to measuring on your own data, not results we are claiming.',

  audienceEyebrow: 'WHO IT IS FOR',
  audienceHeading: 'Built for these teams.',
} as const;

/** The /products index page. */
export const productsIndex = {
  eyebrow: 'PRODUCTS',
  heading: 'One safety system. Six products.',
  lead: 'Start with one workflow and add the rest as trust grows. Every product shares the same agents, rules and evidence trail.',

  matrixEyebrow: 'CAPABILITY MATRIX',
  matrixHeading: 'What each product covers.',
  matrixLead:
    'A tick marks a capability the product states today. Nothing is inferred, so an empty cell means we are not claiming it yet.',
  matrixColumnLabel: 'CAPABILITY',
  plannedLabel: 'Planned',
} as const;
