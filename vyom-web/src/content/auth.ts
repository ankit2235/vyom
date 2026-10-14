/** /login */

export const loginPage = {
  eyebrow: 'SIGN IN',
  heading: 'Sign in to Vyom',
  lead: 'This is a concept-preview sign-in. It sets a local session cookie and opens the sample tenant. It is not production authentication.',
  email: { label: 'Work email', placeholder: 'you@hospital.example' },
  submit: 'Continue to sample tenant',
  home: 'Back to the public site',
  notice: 'Default destination is the fictional tenant demo-hospital. Patient and claim figures inside the app are sample data.',
} as const;
