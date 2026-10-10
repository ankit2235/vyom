/**
 * /privacy and /terms.
 *
 * Both are drafts and say so at the top. They describe what the site does
 * today — a static site with no analytics, cookies or third-party forms —
 * and nothing more.
 */

export const draftNotice = {
  label: 'DRAFT',
  text: 'Draft — pending legal review. This page describes how the site works today and is not yet a binding legal document.',
} as const;

export const privacyPage = {
  eyebrow: 'PRIVACY',
  heading: 'Privacy',
  updated: 'Last updated 10 October 2026',
  sections: [
    {
      title: 'The short version',
      body: 'This website collects nothing. There is no analytics, no cookies, no tracking pixels and no third-party form service. The contact form never sends data to us — it opens a pre-filled email in your own mail app, and you decide whether to send it.',
    },
    {
      title: 'What this site stores',
      body: 'Nothing. No cookies are set and no browser storage is used. Our hosting provider may keep standard server logs, including IP addresses, for a short period for security and abuse prevention.',
    },
    {
      title: 'What happens when you email us',
      body: 'If you send us an email, we hold it to reply to you and to keep a record of the conversation. We do not add you to a mailing list, and we do not share your details with anyone else.',
    },
    {
      title: 'Customer data in our products',
      body: 'This policy covers the website only. Data processed in Vyom’s products is covered by the agreement with that customer: it is processed and stored in India, encrypted in transit and at rest, isolated per customer, never used to train models without written consent, and handled by model providers under zero-retention terms.',
    },
    {
      title: 'Your rights',
      body: 'Under India’s Digital Personal Data Protection Act you may ask what personal data we hold about you, ask us to correct it, and ask us to erase it. Write to the address below and we will respond.',
    },
  ],
} as const;

export const termsPage = {
  eyebrow: 'TERMS',
  heading: 'Terms',
  updated: 'Last updated 10 October 2026',
  sections: [
    {
      title: 'About this site',
      body: 'This is the marketing website of Vyom. It describes products that are in development. Screens shown on this site are concept previews built with sample data and fictional drug codes, and do not show any real customer’s data.',
    },
    {
      title: 'Figures on this site',
      body: 'Every figure here is one of three things, and is labelled as such: a sourced market fact with its source shown, a target we intend to measure in pilots, or sample data in a concept screen. Targets are goals, not results, and nothing on this site is a guarantee of performance.',
    },
    {
      title: 'Not medical or regulatory advice',
      body: 'Nothing on this site is medical, clinical or regulatory advice. Pharmacovigilance obligations remain with the marketing authorisation holder. Any Vyom service is provided under a separate written agreement that sets out responsibilities on both sides.',
    },
    {
      title: 'Availability and changes',
      body: 'The site is provided as it is, without warranty. Products, pricing shapes and roadmap items described here may change. We may update this site at any time.',
    },
    {
      title: 'Intellectual property',
      body: 'The content, wordmark and design of this site belong to Vyom unless stated otherwise.',
    },
    {
      title: 'Contact',
      body: 'Questions about these terms can go to the address below.',
    },
  ],
} as const;

export const notFoundPage = {
  code: '404',
  eyebrow: 'PAGE NOT FOUND',
  heading: 'This page has gone missing.',
  lead: 'The link may be out of date, or the page may not exist yet. Here is where most people are heading.',
  links: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Platform', href: '/platform' },
    { label: 'How we start', href: '/how-we-start' },
    { label: 'Company', href: '/company' },
    { label: 'Contact', href: '/contact' },
  ],
} as const;
