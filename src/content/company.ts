import { siteConfig } from '~/site.config';

/** /company — mission, the name, who is here, and what we hold to. */

export const companyPage = {
  eyebrow: 'COMPANY',
  heading: 'Make every medicine safer by making drug safety faster, cheaper and provable.',
  lead: 'Vyom is an AI-native pharmacovigilance company, built in India for the world.',

  name: {
    eyebrow: 'THE NAME',
    heading: 'Vyom (व्योम) is Sanskrit for sky.',
    body: 'Sky as in the whole of it: every case, every journal, every check, seen at once rather than sampled. It is also a reminder of where we are building from.',
    location: siteConfig.locationMono,
  },

  team: {
    eyebrow: 'TEAM',
    heading: 'Who is here, and who we are hiring.',
    lead: 'A small team by design. We would rather name the roles we have not filled than imply they are filled.',
    /**
     * `status` is deliberate: nobody is listed as present unless they are.
     * Bios marked as a placeholder stay bracketed until they are written.
     */
    members: [
      {
        name: 'Prarabdha',
        role: 'Founder & CEO',
        status: 'here',
        bio: '[BIO PLACEHOLDER]',
      },
      {
        name: 'Head of Drug Safety',
        role: 'Qualified safety physician',
        status: 'joining',
        bio: 'Joining soon. This role signs off on clinical decisions and owns the thresholds no agent may cross.',
      },
      {
        name: 'Quality & Validation Lead',
        role: 'Quality and computerised-system validation',
        status: 'hiring',
        bio: 'We are hiring. This role owns the evaluation gates, the audit trail and inspection readiness.',
      },
      {
        name: 'Medical advisory network',
        role: 'Advisers',
        status: 'placeholder',
        bio: '[ADVISERS PLACEHOLDER]',
      },
    ],
    statusLabel: {
      here: null,
      joining: 'JOINING SOON',
      hiring: 'HIRING',
      placeholder: 'TO BE ANNOUNCED',
    },
  },

  values: {
    eyebrow: 'VALUES',
    heading: 'What we hold to.',
    items: [
      {
        title: 'Patient safety first',
        body: 'Every shortcut is measured against one question: could this cause a real adverse event to go unreported? If it could, we do not take it.',
      },
      {
        title: 'Evidence over claims',
        body: 'We publish measures, not adjectives. Anything we have not measured on your data, we say we have not measured.',
      },
      {
        title: 'Humans decide',
        body: 'AI proposes and rules check, but a qualified person decides, and the record shows who. That is not a transitional arrangement.',
      },
      {
        title: 'Built in India for the world',
        body: 'India supplies a large share of the world’s medicines. The safety work for them should be world-class and run from here.',
      },
    ],
  },

  careers: {
    eyebrow: 'CAREERS',
    heading: 'Two roles open.',
    body: 'If you are a qualified safety physician or a quality and validation lead who has looked at how pharmacovigilance is done and thought it could be done properly, we would like to hear from you.',
    cta: 'Write to us',
  },
} as const;
