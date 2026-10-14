/** Copy for the signed-in SaaS shell. Numbers here are sample data. */

export const platformShell = {
  productLabel: 'VYOM',
  sample: 'SAMPLE DATA',
  fictional: '(FICTIONAL)',
  nav: [
    { hrefSuffix: '/dashboard', label: 'Dashboard' },
    { hrefSuffix: '/console', label: 'Console' },
    { hrefSuffix: '/settings', label: 'Settings' },
  ],
  tenantLabel: 'Active tenant',
  signOut: 'Sign out',
} as const;

export const dashboardPage = {
  title: 'Dashboard',
  heading: 'Executive view',
  lead: 'Claims volume, RGHS and TPA turnaround, and SLA posture for the active hospital tenant.',
  metrics: [
    { value: '1,284', label: 'Claims in the sample window', hint: 'Volume, not a live feed' },
    { value: '18 h', label: 'RGHS median turnaround (target)', hint: 'DESIGN TARGET on sample mix' },
    { value: '26 h', label: 'TPA median turnaround (target)', hint: 'DESIGN TARGET on sample mix' },
    { value: '94%', label: 'SLA met in sample window (target)', hint: 'DESIGN TARGET' },
  ],
  queueHeading: 'Open work',
  queue: [
    { id: 'VY-CASE-1042', scheme: 'RGHS', age: '4 h', band: 'YELLOW' },
    { id: 'VY-CASE-1048', scheme: 'TPA (generic)', age: '1 h', band: 'RED' },
    { id: 'VY-CASE-1051', scheme: 'RGHS', age: '22 min', band: 'YELLOW' },
  ],
} as const;

export const consolePage = {
  title: 'Console',
  heading: 'Operator view',
  lead: 'Split-screen review. System One proposes; a human decides. Shortcuts: [A] Accept, [C] Correct, [E] Escalate.',
  shortcuts: [
    { key: 'A', label: 'Accept', tone: 'accent' as const },
    { key: 'C', label: 'Correct', tone: 'amber' as const },
    { key: 'E', label: 'Escalate', tone: 'amber' as const },
  ],
  documentLabel: 'Source document (sample PDF page)',
  documentTitle: 'Discharge summary — VY-CASE-1048',
  documentBody: [
    'Drug: VY-201. Admission for inpatient observation. Clause 4.1 inpatient proof is present on the sample sheet.',
    'Itemised bill line 14 (pharmacy) does not match the treatment chart timestamp. Operator to confirm before TPA submission.',
  ],
  findingLabel: 'Proposed finding',
  finding: 'YELLOW — pharmacy line vs treatment sheet mismatch. Not auto-closed.',
  statusIdle: 'Waiting for a decision',
  statusAccept: 'Accepted — sample action only, nothing submitted.',
  statusCorrect: 'Marked for correction — sample action only.',
  statusEscalate: 'Escalated to a physician queue — sample action only.',
} as const;

export const settingsPage = {
  title: 'Settings',
  heading: 'Hospital admin',
  lead: 'Tariff YAML overrides and webhook keys for this tenant. Values below are placeholders.',
  tariffLabel: 'Tariff override (YAML)',
  tariffSample: `# SAMPLE DATA — not a live tariff
scheme: rghs
version: 0
overrides:
  - code: ROOM-DAY
    note: '[TARIFF OVERRIDE PLACEHOLDER]'
`,
  webhookLabel: 'Webhook signing key',
  webhookValue: '[WEBHOOK KEY]',
  webhookHelp: 'Replace the bracketed value in your own environment. This page never stores a real key.',
} as const;

export const opsPage = {
  title: 'Ops',
  heading: 'Cross-tenant queue',
  lead: 'Internal medical auditors. Sample rows only — no live tenants.',
  rows: [
    { tenant: 'demo-hospital', id: 'VY-CASE-1048', band: 'RED', waiting: '1 h' },
    { tenant: 'demo-tpa', id: 'VY-CASE-2201', band: 'YELLOW', waiting: '3 h' },
    { tenant: 'demo-hospital', id: 'VY-CASE-1051', band: 'YELLOW', waiting: '22 min' },
  ],
} as const;
