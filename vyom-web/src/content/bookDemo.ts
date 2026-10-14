/** /book-demo — hospitals and TPAs. Reuses the contact form behaviour. */

export const bookDemoPage = {
  eyebrow: 'BOOK A DEMO',
  heading: 'See Vyom on a workflow you already run.',
  lead: 'For hospital TPA desks and pharmacovigilance teams. We walk through the console on sample data first, then a retrospective benchmark on yours if you want proof before price.',
  points: [
    'Sample screens only — no live patient or claim files on this site.',
    'Hospital and TPA walkthroughs use fictional identifiers (VY-CASE-xxxx).',
    'Nothing from this form is stored. It opens a pre-filled email in your mail app.',
  ],
} as const;
