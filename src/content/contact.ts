/** /contact — the design-partner ask and the form that sends it. */

export const contactPage = {
  eyebrow: 'DESIGN PARTNERS',
  heading: 'Become a design partner.',
  lead: 'We are onboarding a small group of drug-safety teams at generics exporters and mid-sized pharma.',

  benefitsHeading: 'What partners get',
  benefits: [
    {
      title: 'A free retrospective benchmark',
      body: 'We re-run one quarter of your past cases or literature and show, item by item, what your current process caught and missed. The report is yours to keep either way.',
    },
    {
      title: 'Early pricing',
      body: 'Design-partner rates, held for the term of the first production agreement.',
    },
    {
      title: 'Input on the roadmap',
      body: 'A direct line to what we build next, and first use of it.',
    },
  ],

  form: {
    heading: 'Tell us about your portfolio',
    /** Nothing is stored. The page says so, plainly, next to the button. */
    privacyNote:
      'Nothing is stored. This form opens a pre-filled email in your own mail app — the details never reach a server of ours, and there is no analytics, cookie or third-party form service on this site.',
    fields: {
      name: { label: 'Name', placeholder: 'Your name', required: true },
      email: { label: 'Work email', placeholder: 'you@company.com', required: true },
      company: { label: 'Company', placeholder: 'Company name', required: true },
      role: { label: 'Role', placeholder: 'Head of Pharmacovigilance', required: false },
      molecules: {
        label: 'Number of molecules',
        placeholder: 'Approximate is fine',
        required: false,
      },
      interest: { label: 'What would you like benchmarked?', required: false },
      message: {
        label: 'Anything else',
        placeholder: 'Volumes, current setup, timelines — whatever is useful.',
        required: false,
      },
    },
    interestOptions: [
      { value: 'cases', label: 'Case processing' },
      { value: 'literature', label: 'Literature screening' },
      { value: 'audit', label: 'Auditing another vendor’s cases' },
      { value: 'other', label: 'Something else' },
    ],
    submit: 'Open a pre-filled email',
    submitting: 'Preparing…',
    optional: 'Optional',
    errors: {
      name: 'Please tell us your name.',
      email: 'Please enter a work email so we can reply.',
      emailFormat: 'That does not look like an email address.',
      company: 'Please tell us which company you are with.',
    },
    successHeading: 'Your email is ready',
    successBody:
      'We have opened a pre-filled message in your mail app. If nothing happened, your browser may have blocked it — use the address below instead.',
    fallbackLabel: 'OR WRITE TO US DIRECTLY',
  },
} as const;
