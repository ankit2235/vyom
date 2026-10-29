/**
 * Copy for the evidence assistant. The assistant is scripted: fixed rules
 * assemble each answer from the record and the alerts dataset, and these
 * templates only word the result. No language model runs anywhere.
 */

export type Intent =
  | 'batch'
  | 'distribution'
  | 'same-product'
  | 'relationship'
  | 'unverified'
  | 'missing'
  | 'changes'
  | 'regulatory'
  | 'causality'
  | 'clinical'
  | 'unknown';

export const assistantCopy = {
  eyebrow: 'EVIDENCE ASSISTANT',
  heading: 'Ask about the evidence',
  chip: 'SCRIPTED · NO AI MODEL RUNS HERE',
  lead: 'Answers are assembled by fixed rules from this record and the official alerts on this site. Every answer links to its evidence and says so when a connection cannot be established. It cannot diagnose, establish causality or confirm a hypothesis.',
  suggested: 'SUGGESTED QUESTIONS',
  inputLabel: 'Ask your own question',
  placeholder: 'For example: which claims remain unverified?',
  ask: 'Ask',
  you: 'QUESTION',
  verdict: {
    answered: 'ANSWERED FROM THE RECORD',
    cannot: 'CANNOT BE ESTABLISHED',
    'out-of-scope': 'OUTSIDE WHAT THIS PANEL CAN ANSWER',
  },
  alertLink: 'Official alert',
} as const;

export const suggestedQuestions: readonly { readonly intent: Intent; readonly label: string }[] = [
  { intent: 'batch', label: 'Where has this batch been documented?' },
  { intent: 'distribution', label: 'Which locations have verified distribution records?' },
  { intent: 'same-product', label: 'Which reports mention the same product?' },
  { intent: 'relationship', label: 'What evidence supports this relationship?' },
  { intent: 'unverified', label: 'Which claims remain unverified?' },
  { intent: 'missing', label: 'What documents are missing?' },
  { intent: 'changes', label: 'What changed since the last source review?' },
  { intent: 'regulatory', label: 'Which regulatory actions have been documented?' },
];

/** Free-text routing, checked in order. The first pattern that matches wins. */
export const intentPatterns: readonly { readonly intent: Intent; readonly pattern: RegExp }[] = [
  { intent: 'clinical', pattern: /diagnos|treat|dose|dosage|should (i|we|she|he) (take|use|stop)|safe to (take|use)/i },
  { intent: 'causality', pattern: /caus|kill|responsib|blame|fault|led to|because of|guilty/i },
  { intent: 'batch', pattern: /batch|lot\b/i },
  { intent: 'distribution', pattern: /distribut|location|where|cit(y|ies)|state|map|place/i },
  { intent: 'same-product', pattern: /same (product|drug|manufacturer|ingredient)|other (report|alert)|mention|similar|related/i },
  { intent: 'relationship', pattern: /relationship|link|support|connect/i },
  { intent: 'unverified', pattern: /unverif|not verified|unconfirmed|claim/i },
  { intent: 'regulatory', pattern: /regulat|action|ban|recall|licen|order|seiz/i },
  { intent: 'missing', pattern: /missing|document|invoice|record|gap/i },
  { intent: 'changes', pattern: /chang|update|since|latest|new/i },
];

export const answerCopy = {
  batch: {
    none: 'This cannot be established: no batch or lot number is published in the sources read.',
    lane: (label: string) => `${label}: batch number not published.`,
    listed: (product: string, batch: string, outlet: string) => `${product} batch ${batch} is listed by ${outlet}.`,
    inAlert: (batch: string, title: string) => `Batch ${batch} also appears in “${title}”.`,
    notInAlerts: 'None of these batch numbers appears in the official alerts loaded on this site.',
    noDistribution: 'No source documents where these batches were distributed.',
  },
  distribution: {
    none: 'No location has a verified distribution record for this product or batch.',
    reported: (place: string, evidence: string) => `${place} — reported, not verified. ${evidence}`,
    noMap: 'The sources do not describe where these batches were distributed.',
  },
  sameProduct: {
    none: 'No other record or official alert on this site mentions the same product, active ingredient or manufacturer.',
    record: (title: string, reason: string) => `“${title}” mentions the same ${reason}.`,
    alertRow: (product: string, batch: string, reason: string) => `An official alert lists ${product}, batch ${batch} — same ${reason}.`,
    notLinked: 'This does not link the alert or record to this case: the product, batch or manufacturer differs, and no source connects them.',
    reasons: { product: 'product name', ingredient: 'active ingredient', manufacturer: 'manufacturer name' },
  },
  relationship: {
    summary: (total: number, counts: string) => `Of ${total} supply-chain relationships: ${counts}.`,
    edge: (from: string, to: string, status: string, note: string) => `${from} → ${to} (${status}). ${note}`,
    batchTie: (product: string, batch: string, maker: string) => `${product} batch ${batch} is tied to ${maker} in the official document.`,
    none: 'No relationship in this record is supported beyond what the sources state above.',
  },
  unverified: {
    summary: (n: number) =>
      `${n} ${n === 1 ? 'statement rests' : 'statements rest'} on a single report or ${n === 1 ? 'is' : 'are'} not established:`,
    more: (n: number) => `…and ${n} more in the Reported claims section.`,
    edges: (n: number) => `${n} supply-chain relationships are unverified or only inferred.`,
    none: 'Every statement in this record rests on an official document or on corroborating outlets.',
  },
  missing: {
    summary: 'Documents an investigator would need, which no source provides:',
    gaps: 'Open evidence gaps:',
  },
  changes: {
    once: (date: string) =>
      `Only one source review is recorded, on ${date}. No later check has run, so any change since then cannot be established.`,
    corrections: 'Corrections made during that review:',
  },
  regulatory: {
    none: 'No regulatory action is documented in the sources for this record.',
  },
  causality: {
    lead: 'This panel cannot establish causality. It can only show what the sources say about it:',
    noStatement: 'The sources read do not make a causal finding for this record.',
  },
  clinical: 'This panel cannot diagnose, give treatment advice or judge whether a medicine is safe for someone. Please ask a qualified health professional.',
  unknown: 'This panel answers questions about the evidence in this record only. Try one of the suggested questions.',
} as const;
