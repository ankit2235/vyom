/**
 * Pure helpers over the public-source records: counting, dates and search.
 * No data lives here — only arithmetic over what `content/intelligence` holds.
 */

import { categoryLabel, statusLabel, type OverviewMeasure } from '@/content/intelligence/dashboard';
import { getSource } from '@/content/intelligence/sources';
import type { Category, EvidenceStatus, IntelRecord, IsoDate, RecordOrigin } from '@/content/intelligence/types';

const dateFormat = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `2026-05-25` → `25 May 2026`. UTC, so server and browser always agree. */
export function formatDate(iso: IsoDate): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

/** Earliest and latest publication dates across a record's sources. */
export function publishedRange(record: IntelRecord): { readonly first: IsoDate; readonly last: IsoDate } {
  const dates = record.sourceIds.map((id) => getSource(id).publishedOn).sort();
  return { first: dates[0] ?? '', last: dates[dates.length - 1] ?? '' };
}

/** The most recent day any source in the set was read. */
export function lastRead(records: readonly IntelRecord[]): IsoDate {
  const dates = records.flatMap((record) => record.sourceIds.map((id) => getSource(id).retrievedOn)).sort();
  return dates[dates.length - 1] ?? '';
}

/** True when at least one statement rests on an official document. */
export function hasOfficialFinding(record: IntelRecord): boolean {
  return record.statements.some((statement) => statement.basis === 'official');
}

/** `alertCount` is the number of official alert documents loaded alongside the records. */
export function countFor(measure: OverviewMeasure, records: readonly IntelRecord[], alertCount = 0): number {
  switch (measure) {
    case 'official-alerts':
      return records.filter((r) => r.statuses.includes('official-alert')).length + alertCount;
    case 'historical':
      return records.filter((r) => r.origin === 'historical-case' && r.categories.includes('drug-quality')).length;
    case 'product-investigations':
      return records.filter((r) => r.products.length > 0).length;
    case 'open-gaps':
      return records.filter((r) => r.gaps.length > 0).length;
  }
}

export type RecordFilters = {
  readonly query: string;
  readonly categories: readonly Category[];
  readonly type: 'all' | RecordOrigin;
  readonly evidence: 'all' | 'official' | 'media';
  readonly status: 'all' | EvidenceStatus;
  readonly year: 'all' | string;
};

export const emptyFilters: RecordFilters = {
  query: '',
  categories: [],
  type: 'all',
  evidence: 'all',
  status: 'all',
  year: 'all',
};

/**
 * Everything a person might search by: product, ingredient, manufacturer,
 * batch, distributor, hospital, place, category, status and source.
 */
function haystack(record: IntelRecord): string {
  return [
    record.title,
    record.summary,
    ...record.products.flatMap((p) => [p.name, p.form, ...p.activeIngredients, ...p.batches.map((b) => b.batch)]),
    ...record.parties.flatMap((party) => [party.name, party.place ?? '']),
    record.location.city ?? '',
    record.location.state ?? '',
    record.location.country,
    ...record.categories.map((c) => categoryLabel[c]),
    ...record.statuses.map((s) => statusLabel[s]),
    ...record.sourceIds.map((id) => getSource(id).outlet),
  ]
    .join(' ')
    .toLowerCase();
}

export function filterRecords(records: readonly IntelRecord[], filters: RecordFilters): IntelRecord[] {
  const terms = filters.query.toLowerCase().split(/\s+/).filter(Boolean);

  return records
    .filter((record) => {
      if (terms.length > 0) {
        const text = haystack(record);
        if (!terms.every((term) => text.includes(term))) return false;
      }
      if (filters.categories.length > 0 && !filters.categories.some((c) => record.categories.includes(c))) {
        return false;
      }
      if (filters.type !== 'all' && record.origin !== filters.type) return false;
      if (filters.evidence === 'official' && !hasOfficialFinding(record)) return false;
      if (filters.evidence === 'media' && hasOfficialFinding(record)) return false;
      if (filters.status !== 'all' && !record.statuses.includes(filters.status)) return false;
      if (filters.year !== 'all' && !publishedRange(record).first.startsWith(filters.year)) return false;
      return true;
    })
    .sort((a, b) => publishedRange(b).last.localeCompare(publishedRange(a).last));
}
