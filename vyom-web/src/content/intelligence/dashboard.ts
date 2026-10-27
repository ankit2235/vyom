/** /intelligence copy and labels. Counts are never written here — see lib/intelligence. */

import type { Basis, Category, EvidenceStatus, PartyRole, RecordOrigin } from './types';

export const intelligenceMeta = {
  title: 'Safety Intelligence',
  description:
    'Explore real drug-quality incidents and official alerts from public sources. Every statement links to its source, and every evidence gap is shown.',
} as const;

export const intelligencePage = {
  eyebrow: 'SAFETY INTELLIGENCE · PREVIEW',
  heading: 'Drug-safety evidence, traced to its sources.',
  lead: 'Explore real drug-quality incidents and official alerts. Every statement links to the document it came from, and every gap is shown rather than filled.',
  banner: {
    label: 'PUBLIC-SOURCE RECORDS · NOT LIVE MONITORING',
    text: 'Each record was read by hand from its public source. Nothing on this page updates automatically, and no patient-identifiable information is shown.',
    lastRead: 'SOURCES LAST READ',
  },
  alertsLink: {
    label: 'Official alerts',
    note: (n: number) => `${n} CDSCO alert documents, transcribed from the originals, with a manual import.`,
    href: '/intelligence/alerts',
  },
} as const;

export type OverviewMeasure = 'official-alerts' | 'historical' | 'product-investigations' | 'open-gaps';

/**
 * The eight overview tiles, in the brief's order. A tile either counts loaded
 * records (`measure`) or says plainly that its source is not connected.
 */
export const overviewTiles: readonly {
  readonly label: string;
  readonly measure: OverviewMeasure | null;
  readonly notConnected?: string;
}[] = [
  { label: 'Recently published drug-safety reports', measure: null, notConnected: 'No live source check has run.' },
  { label: 'Official drug-quality alerts', measure: 'official-alerts' },
  { label: 'Historical drug-quality incidents', measure: 'historical' },
  { label: 'Product and batch investigations', measure: 'product-investigations' },
  { label: 'Adverse-event reports from permitted sources', measure: null, notConnected: 'No permitted source connected.' },
  { label: 'Literature and regulatory updates', measure: null, notConnected: 'No literature or regulatory feed connected.' },
  { label: 'Cases awaiting human review', measure: null, notConnected: 'Review queues live in the signed-in workspace.' },
  { label: 'Investigations with unresolved evidence gaps', measure: 'open-gaps' },
];

export const overviewCopy = {
  label: 'OVERVIEW',
  countedFrom: (records: number, alerts: number) => `COUNTED FROM ${records} RECORDS AND ${alerts} OFFICIAL ALERTS`,
  notConnectedChip: 'NOT CONNECTED',
} as const;

export const explorerCopy = {
  heading: 'Records',
  searchLabel: 'Search records',
  searchPlaceholder: 'Drug, batch, company, place…',
  categoryLabel: 'Category',
  typeLabel: 'Record type',
  evidenceLabel: 'Evidence',
  statusLabel: 'Status',
  yearLabel: 'Published',
  anyStatus: 'Any status',
  anyYear: 'Any year',
  clear: 'Clear filters',
  showing: (shown: number, total: number) => `Showing ${shown} of ${total} records`,
  empty: 'No records match these filters.',
  emptyNew:
    'Newly published reports appear only after a live source check, and none has run in this preview.',
} as const;

export const recordTypes = [
  { value: 'all', label: 'All records' },
  { value: 'historical-case', label: 'Historical cases' },
  { value: 'recently-published', label: 'Newly published' },
] as const;

export const evidenceFilters = [
  { value: 'all', label: 'All evidence' },
  { value: 'official', label: 'Official-source findings' },
  { value: 'media', label: 'Media-reported leads' },
] as const;

export const categoryLabel: Record<Category, string> = {
  'drug-quality': 'Drug quality',
  'substandard-or-falsified': 'Substandard or suspected counterfeit',
  'adverse-event': 'Adverse events',
  'regulatory-action': 'Recalls and regulatory actions',
  'literature-or-signal': 'Literature and safety signals',
  'official-alert': 'Official alerts',
};

export const statusLabel: Record<EvidenceStatus, string> = {
  'official-alert': 'Official alert',
  'reported-by-media': 'Reported by media',
  'historical-case': 'Historical case',
  'under-investigation': 'Under investigation',
  'distribution-verified': 'Distribution verified',
  'potential-link-unverified': 'Potential link — unverified',
  'causality-not-established': 'Causality not established',
};

export const basisLabel: Record<Basis, string> = {
  official: 'Official source',
  corroborated: 'Corroborated',
  reported: 'Single report',
  'not-established': 'Not established',
};

export const basisHelp: Record<Basis, string> = {
  official: 'Stated in an official document that was read directly.',
  corroborated: 'Reported by two or more independent outlets.',
  reported: 'Reported by one outlet only.',
  'not-established': 'The sources say this is unknown or was not shown.',
};

export const originLabel: Record<RecordOrigin, string> = {
  'live-monitoring': 'Live source monitoring',
  'recently-published': 'Recently published',
  'historical-case': 'Historical case',
  'hospital-integrated': 'Hospital-integrated case',
  'manual-entry': 'Manual entry',
};

export const roleLabel: Record<PartyRole, string> = {
  manufacturer: 'Manufacturer',
  distributor: 'Distributor',
  laboratory: 'Testing laboratory',
  hospital: 'Hospital',
  regulator: 'Regulator',
  investigator: 'Investigation',
};

export const cardCopy = {
  publicSource: 'PUBLIC SOURCE',
  product: 'PRODUCT',
  location: 'LOCATION',
  eventDate: 'EVENT DATE',
  published: 'PUBLISHED',
  batch: 'BATCH',
  whyItMatters: 'WHY IT MATTERS',
  sources: (n: number) => `${n} ${n === 1 ? 'SOURCE' : 'SOURCES'}`,
  review: 'Review Case',
} as const;

export const detailCopy = {
  back: 'All records',
  nav: 'On this record',
  causality:
    'Causality not established. The investigations reported in the sources did not show that this product caused the deaths or harm described. Treat every link below as unproven unless a source says otherwise.',
  evidenceHeader: 'EVIDENCE',
  sourceKind: { official: 'OFFICIAL', media: 'MEDIA' },
  batchHeaders: ['Batch', 'Manufactured', 'Expires', 'Finding'],
  readOn: 'Read by hand on',
} as const;

/**
 * The case page's sections, in reading order. `requires` names the record
 * data a section needs; a section without that data is not shown.
 */
export const caseSections = [
  { id: 'support', label: 'How Vyom could support', requires: 'workspace' },
  { id: 'assistant', label: 'Evidence assistant', requires: null },
  { id: 'verified', label: 'Verified facts', requires: null },
  { id: 'reported', label: 'Reported claims', requires: null },
  { id: 'unknown', label: 'Unknown or not established', requires: null },
  { id: 'health', label: 'Reported health concerns', requires: 'healthConcerns' },
  { id: 'actions', label: 'Regulatory actions', requires: 'actions' },
  { id: 'timeline', label: 'Timeline', requires: 'timeline' },
  { id: 'batches', label: 'Product and batch traceability', requires: null },
  { id: 'graph', label: 'Supply-chain relationships', requires: 'workspace' },
  { id: 'distribution', label: 'Distribution evidence', requires: 'workspace' },
  { id: 'map', label: 'Geographic investigation', requires: 'workspace' },
  { id: 'comparison', label: 'Cross-hospital comparison', requires: 'workspace' },
  { id: 'clinical', label: 'Clinical chronology', requires: 'workspace' },
  { id: 'gaps', label: 'Evidence gaps', requires: null },
  { id: 'organisations', label: 'Organisations', requires: null },
  { id: 'sources', label: 'Source documents', requires: null },
  { id: 'review', label: 'Suggested review steps', requires: 'workspace' },
  { id: 'audit', label: 'Audit trail', requires: null },
] as const;

export type CaseSectionId = (typeof caseSections)[number]['id'];

export const statementBuckets = {
  verified: {
    bases: ['official', 'corroborated'],
    help: 'Stated in an official document read directly, or reported by two or more independent outlets.',
    mediaOnly:
      'No official document has been read for this record, so “verified” here means corroborated by independent outlets.',
  },
  reported: {
    bases: ['reported'],
    help: 'Reported by one outlet and not independently confirmed.',
  },
  unknown: {
    bases: ['not-established'],
    help: 'The sources say this is unknown or was not shown.',
  },
} as const;

export const emptyBucket = 'Nothing in this record falls here.';

export const supportCopy = {
  eyebrow: 'RETROSPECTIVE ILLUSTRATION',
  heading: 'How Vyom Could Support This Investigation',
  lead: 'Vyom could help investigators assemble product identity, batch, distribution, storage, administration, clinical and regulatory records into one connected evidence trail.',
  disclaimer:
    'Written after the fact to illustrate potential capabilities. Vyom did not detect, investigate or prevent this incident, and holds none of its records.',
  columns: { area: 'RECORD', how: 'WHAT VYOM COULD DO', here: 'IN THIS CASE' },
} as const;

export const timelineCopy = {
  filterLabel: 'Show events',
  all: 'All',
  kinds: {
    clinical: 'Clinical',
    testing: 'Testing',
    regulatory: 'Regulatory',
    investigation: 'Investigation',
  },
  note: 'Dates are shown exactly as precise as the sources make them. Undated events are placed by when they were reported.',
} as const;

export const batchCopy = {
  batchNumber: 'BATCH NUMBER',
  notPublished: 'Not published',
  known: 'WHAT THE SOURCES SAY',
  unknown: 'NOT KNOWN',
  conflict: 'CONFLICTING DESCRIPTIONS',
} as const;

export const distributionCopy = {
  tableLabel: 'Distribution evidence',
  headers: ['From', 'To', 'Item', 'Quantity', 'Status', 'Sources'],
  noSource: 'No source',
  rule: 'A link is shown as documented only when a source document records it. Brand names alone never link a batch to a place.',
  difference: 'DIFFERENCE',
  differenceNote: (n: string) => `${n} more units sold than purchased`,
} as const;

export const linkStatusLabel = {
  documented: 'Documented',
  reported: 'Reported',
  'not-established': 'Not established',
} as const;

export const clinicalCopy = {
  availability: 'WHAT RECORDS EXIST',
} as const;

export const reviewCopy = {
  label: 'SUGGESTED · FOR A QUALIFIED REVIEWER',
  note: 'Suggestions only. A qualified reviewer decides what to do, and records why.',
} as const;

export const auditCopy = {
  origin: 'Origin',
  firstPublished: 'First source published',
  lastRead: 'Sources last read',
  corrections: 'Reviewer corrections',
  kinds: {
    'source-read': 'SOURCE READ',
    created: 'CREATED',
    classified: 'CLASSIFIED',
    correction: 'CORRECTION',
  },
} as const;

export const scopeCopy = { label: 'SCOPE OF THE ALERT' } as const;

export const markerLabel = {
  'verified-batch': 'Verified batch presence',
  'reported-distribution': 'Reported distribution',
  'potential-exposure': 'Potential exposure — unverified',
  'investigation-pending': 'Investigation pending',
  'not-established': 'Batch relationship not established',
  'ruled-out': 'Ruled out',
  'investigation-site': 'Investigation site',
  'supply-origin': 'Reported supply origin',
} as const;

export const mapCopy = {
  label: 'SCHEMATIC MAP',
  note: 'Places are positioned by approximate latitude and longitude. No borders are drawn.',
  exposure: 'EXPOSURE TO THE PRODUCT',
  other: 'OTHER ROLES · NOT EXPOSURE',
  none: '0',
  prompt: 'Select a place to see its sources, dates and batch evidence.',
  role: 'ROLE',
  when: 'WHEN',
  batch: 'PRODUCT AND BATCH EVIDENCE',
  evidence: 'EVIDENCE',
  unplaced: 'NOT PLACED ON THE MAP',
} as const;

export const graphCopy = {
  stages: {
    manufacturer: 'Manufacturer',
    batch: 'Batch / lot',
    distributor: 'Distributor',
    wholesaler: 'Wholesaler / stockist',
    hospital: 'Hospital',
    administration: 'Administration record',
    report: 'Safety report',
  },
  edge: {
    verified: 'Verified',
    reported: 'Reported',
    inferred: 'Inferred',
    unverified: 'Unverified',
  },
  edgeHelp: {
    verified: 'Recorded in an official or primary document that was read.',
    reported: 'Stated in a published report.',
    inferred: 'A connection drawn by others, not shown by evidence.',
    unverified: 'No source supports this link.',
  },
  hint: 'Select a box to open its record, or a relationship to see what supports it.',
  graphLabel: 'Supply-chain relationship graph',
  relationships: 'RELATIONSHIPS',
  forNode: (label: string) => `RELATIONSHIPS · ${label.toUpperCase()}`,
  showAll: 'Show all',
  facts: 'WHAT THE SOURCES SAY',
  quantities: 'DOCUMENTED QUANTITIES',
  missing: 'MISSING DOCUMENTS',
  conflicts: 'CONFLICTS AND CONCERNS',
  notNamed: 'NOT NAMED IN ANY SOURCE',
  noSource: 'No source',
  rule: 'Batch identity is never inferred from a brand name. A link is verified only when a document records it.',
  close: 'Close',
} as const;

export const comparisonCopy = {
  rowHeader: 'COMPARE',
  similar: 'SIMILAR',
  different: 'DIFFERENT',
  missing: 'MISSING',
  notInSources: 'NOT IN SOURCES',
  caution:
    'For qualified reviewers. Similar timing or symptoms are not proof of a common cause, and nothing here links a patient to a product.',
} as const;

export const exportCopy = {
  button: 'Export evidence report',
  note: 'Downloads a Markdown file built from this record, with every source link.',
  filename: (slug: string) => `${slug}-evidence-report.md`,
  heading: 'Evidence report',
  exported: 'Exported',
  disclaimer:
    'Built from public sources read by hand. It is not a determination of cause, and every statement carries its own evidence label.',
} as const;
