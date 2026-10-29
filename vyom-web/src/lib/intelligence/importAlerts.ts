/**
 * Parses a manually imported alert list (CSV or JSON) and checks each row.
 * Runs entirely in the browser; the result is never stored or sent.
 */

import { importCopy } from '@/content/intelligence/alertsCopy';

export type ImportedAlert = {
  readonly title: string;
  readonly authority: string;
  readonly publishedOn: string;
  readonly product: string;
  readonly batch: string;
  readonly issue: string;
  readonly documentUrl: string;
  readonly manufacturer: string;
  readonly action: string;
};

export type ImportResult = {
  readonly rows: readonly ImportedAlert[];
  readonly errors: readonly string[];
};

/** RFC 4180-style CSV: quoted fields, doubled quotes, commas and newlines inside quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

function toRecords(text: string): Record<string, unknown>[] | null {
  const trimmed = text.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const data: unknown = JSON.parse(trimmed);
      const list = Array.isArray(data) ? data : [data];
      return list.every((item) => typeof item === 'object' && item !== null)
        ? (list as Record<string, unknown>[])
        : null;
    } catch {
      return null;
    }
  }
  const [header, ...body] = parseCsv(trimmed);
  if (!header) return [];
  const keys = header.map((key) => key.trim());
  return body.map((cells) => Object.fromEntries(keys.map((key, i) => [key, cells[i] ?? ''])));
}

export function parseImport(text: string): ImportResult {
  const { errors: copy, required } = importCopy;
  if (!text.trim()) return { rows: [], errors: [copy.empty] };

  const records = toRecords(text);
  if (records === null) return { rows: [], errors: [copy.json] };
  if (records.length === 0) return { rows: [], errors: [copy.empty] };

  const rows: ImportedAlert[] = [];
  const errors: string[] = [];

  records.forEach((record, index) => {
    const get = (key: string) => String(record[key] ?? '').trim();
    const problems = [
      ...required.filter((key) => !get(key)).map((key) => copy.missing(key)),
      ...(get('publishedOn') && !/^\d{4}-\d{2}-\d{2}$/.test(get('publishedOn')) ? [copy.date] : []),
      ...(get('documentUrl') && !get('documentUrl').startsWith('https://') ? [copy.url] : []),
    ];
    if (problems.length > 0) {
      errors.push(`${copy.line(index + 1)}: ${problems.join(' ')}`);
      return;
    }
    rows.push({
      title: get('title'),
      authority: get('authority'),
      publishedOn: get('publishedOn'),
      product: get('product'),
      batch: get('batch'),
      issue: get('issue'),
      documentUrl: get('documentUrl'),
      manufacturer: get('manufacturer'),
      action: get('action'),
    });
  });

  return { rows, errors };
}
