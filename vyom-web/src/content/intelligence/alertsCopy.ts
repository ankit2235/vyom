/** /intelligence/alerts copy: the official alerts view and the manual import. */

import type { AlertKind } from './types';

export const alertsMeta = {
  title: 'Official Alerts',
  description:
    'Spurious and Not of Standard Quality drug alerts from CDSCO, transcribed from the original documents, with a browser-only manual import.',
} as const;

export const alertsPage = {
  eyebrow: 'OFFICIAL ALERTS · CDSCO',
  heading: 'Official drug-quality alerts.',
  lead: 'Spurious and Not of Standard Quality (NSQ) lists published by India’s drug regulator, transcribed row by row from the original documents.',
  back: 'Safety Intelligence',
  banner: {
    label: 'HISTORICAL DATASET · NOT LIVE MONITORING',
    text: 'These alerts were read by hand from the CDSCO alerts page. Nothing here updates automatically, and newer alerts may exist.',
    lastChecked: 'LAST CHECKED BY HAND',
    newLink:
      'A CDSCO listing entry dated 28 Aug 2025 says NSQ alerts are now published on a new link. That link was not read for this dataset.',
  },
  notLinked: 'Appearing in an alert does not link a batch to any case on this site.',
} as const;

export const alertKindLabel: Record<AlertKind, string> = {
  spurious: 'Spurious',
  nsq: 'Not of Standard Quality',
};

/** Definitions quoted or summarised from the alert documents themselves. */
export const alertKindHelp: Record<AlertKind, string> = {
  spurious:
    'As defined under Section 17-B of the Drugs and Cosmetics Act, 1940 — for example, a drug made under another drug’s name, or one that purports to be the product of a manufacturer of whom it is not truly a product.',
  nsq: 'Drugs that fail to meet the quality standards or specifications, as defined under Section 16 of the Drugs and Cosmetics Act, 1940.',
};

export const alertCopy = {
  authority: 'ISSUING AUTHORITY',
  released: 'RELEASED',
  rows: 'ROWS',
  rowsShown: (shown: number, total: number) => (shown === total ? `${total}` : `${shown} of ${total} shown`),
  action: 'REGULATORY ACTION',
  rowNote: 'NOTE FOR EVERY ROW',
  document: 'Original document (PDF)',
  listing: 'CDSCO listing page',
  readOn: 'Read by hand on',
  headers: ['S.No', 'Product', 'Batch', 'Mfd.', 'Expiry', 'Manufacturer (as listed)', 'Reason for failure', 'Reported by'],
  searchLabel: 'Search alerts',
  searchPlaceholder: 'Product, batch, manufacturer…',
  showing: (rows: number) => `${rows} matching ${rows === 1 ? 'row' : 'rows'}`,
  noMatch: 'No row matches this search.',
} as const;

export const importCopy = {
  heading: 'Manual import',
  lead: 'Add alerts you have checked yourself. Imported rows appear only in this browser tab, are marked unverified, and disappear when you reload. Nothing is uploaded or stored.',
  fileLabel: 'Choose a CSV or JSON file',
  pasteLabel: 'Or paste CSV or JSON',
  pastePlaceholder: 'title,authority,publishedOn,product,batch,issue,documentUrl,manufacturer,action',
  import: 'Import',
  clear: 'Clear imported rows',
  template: 'Download CSV template',
  templateName: 'official-alert-import-template.csv',
  /** Header row, then one example row the owner replaces. Fictional by design. */
  templateCsv:
    'title,authority,publishedOn,product,batch,issue,documentUrl,manufacturer,action\n"[ALERT TITLE]","[ISSUING AUTHORITY]",2026-01-31,"[PRODUCT]","[BATCH]","[REPORTED QUALITY ISSUE]",https://example.org/alert.pdf,"[MANUFACTURER]","[REGULATORY ACTION]"\n',
  required: ['title', 'authority', 'publishedOn', 'product', 'batch', 'issue', 'documentUrl'] as const,
  resultLabel: 'IMPORTED IN THIS TAB · MANUAL ENTRY · UNVERIFIED',
  headers: ['Title', 'Authority', 'Published', 'Product', 'Batch', 'Issue', 'Manufacturer', 'Action', 'Document'],
  imported: (n: number) => `${n} ${n === 1 ? 'row' : 'rows'} imported.`,
  errorsLabel: 'ROWS NOT IMPORTED',
  errors: {
    empty: 'Nothing to import.',
    json: 'The JSON could not be read. It should be a list of objects.',
    missing: (field: string) => `Missing ${field}.`,
    date: 'publishedOn must be a date written as YYYY-MM-DD.',
    url: 'documentUrl must start with https://.',
    line: (n: number) => `Row ${n}`,
  },
  open: 'Open',
} as const;
