'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import {
  categoryLabel,
  evidenceFilters,
  explorerCopy,
  recordTypes,
  statusLabel,
} from '@/content/intelligence/dashboard';
import type { Category, EvidenceStatus, IntelRecord } from '@/content/intelligence/types';
import { emptyFilters, filterRecords, publishedRange, type RecordFilters } from '@/lib/intelligence/records';
import { cn } from '@/lib/cn';
import { CaseCard } from './CaseCard';

const categories = Object.keys(categoryLabel) as Category[];
const statuses = Object.keys(statusLabel) as EvidenceStatus[];

const controlClass =
  'min-h-[44px] w-full rounded-control border border-button bg-panel px-3 text-[14.5px] text-primary placeholder:text-meta';

function Group({ legend, children }: { readonly legend: string; readonly children: ReactNode }) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
      <legend className="mb-2.5 p-0 font-mono text-[11px] tracking-[0.1em] text-meta uppercase">{legend}</legend>
      {children}
    </fieldset>
  );
}

/** A native radio styled as a pill, so arrow keys and screen readers work as usual. */
function RadioPill({
  name,
  checked,
  onChange,
  children,
}: {
  readonly name: string;
  readonly checked: boolean;
  readonly onChange: () => void;
  readonly children: ReactNode;
}) {
  return (
    <label
      className={cn(
        'flex min-h-[40px] cursor-pointer items-center rounded-control border px-3 text-[14px] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent',
        checked ? 'border-strong bg-raised text-primary' : 'border-line text-muted hover:border-strong',
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

/** Search, filters and the record list. Filtering runs in the browser over the loaded records. */
export function RecordExplorer({ records }: { readonly records: readonly IntelRecord[] }) {
  const [filters, setFilters] = useState<RecordFilters>(emptyFilters);
  const id = useId();
  const results = useMemo(() => filterRecords(records, filters), [records, filters]);
  const years = useMemo(
    () => Array.from(new Set(records.map((r) => publishedRange(r).first.slice(0, 4)))).sort().reverse(),
    [records],
  );
  const isFiltered = JSON.stringify(filters) !== JSON.stringify(emptyFilters);

  function update(patch: Partial<RecordFilters>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function toggleCategory(category: Category) {
    setFilters((current) => ({
      ...current,
      categories: current.categories.includes(category)
        ? current.categories.filter((c) => c !== category)
        : [...current.categories, category],
    }));
  }

  return (
    <div className="flex flex-wrap items-start gap-x-8 gap-y-8">
      <form
        role="search"
        aria-label={explorerCopy.searchLabel}
        onSubmit={(event) => event.preventDefault()}
        className="flex min-w-0 flex-[1_1_280px] flex-col gap-7 lg:sticky lg:top-6 lg:max-w-[320px]"
      >
        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${id}-q`} className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">
            {explorerCopy.searchLabel}
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
            placeholder={explorerCopy.searchPlaceholder}
            className={controlClass}
          />
        </div>

        <Group legend={explorerCopy.categoryLabel}>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const pressed = filters.categories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    'min-h-[40px] rounded-control border px-3 text-left text-[13.5px]',
                    pressed ? 'border-strong bg-raised text-primary' : 'border-line text-muted hover:border-strong',
                  )}
                >
                  {categoryLabel[category]}
                </button>
              );
            })}
          </div>
        </Group>

        <Group legend={explorerCopy.typeLabel}>
          <div className="flex flex-wrap gap-2">
            {recordTypes.map((type) => (
              <RadioPill
                key={type.value}
                name={`${id}-type`}
                checked={filters.type === type.value}
                onChange={() => update({ type: type.value })}
              >
                {type.label}
              </RadioPill>
            ))}
          </div>
        </Group>

        <Group legend={explorerCopy.evidenceLabel}>
          <div className="flex flex-wrap gap-2">
            {evidenceFilters.map((option) => (
              <RadioPill
                key={option.value}
                name={`${id}-evidence`}
                checked={filters.evidence === option.value}
                onChange={() => update({ evidence: option.value })}
              >
                {option.label}
              </RadioPill>
            ))}
          </div>
        </Group>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col gap-2.5">
            <label htmlFor={`${id}-status`} className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">
              {explorerCopy.statusLabel}
            </label>
            <select
              id={`${id}-status`}
              value={filters.status}
              onChange={(event) => update({ status: event.target.value as RecordFilters['status'] })}
              className={controlClass}
            >
              <option value="all">{explorerCopy.anyStatus}</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel[status]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex min-w-0 flex-col gap-2.5">
            <label htmlFor={`${id}-year`} className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">
              {explorerCopy.yearLabel}
            </label>
            <select
              id={`${id}-year`}
              value={filters.year}
              onChange={(event) => update({ year: event.target.value })}
              className={controlClass}
            >
              <option value="all">{explorerCopy.anyYear}</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isFiltered ? (
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="min-h-[44px] self-start text-[14px] font-medium text-secondary underline underline-offset-4 hover:text-primary"
          >
            {explorerCopy.clear}
          </button>
        ) : null}
      </form>

      <section aria-labelledby={`${id}-results`} className="flex min-w-0 flex-[3_1_560px] flex-col gap-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id={`${id}-results`} className="m-0 text-[22px] font-semibold text-primary">
            {explorerCopy.heading}
          </h2>
          <p role="status" className="m-0 font-mono text-[12px] tracking-[0.06em] text-meta">
            {explorerCopy.showing(results.length, records.length)}
          </p>
        </div>

        {results.length > 0 ? (
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {results.map((record) => (
              <li key={record.slug}>
                <CaseCard record={record} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col gap-2 rounded-panel border border-dashed border-dash px-6 py-10 text-center">
            <p className="m-0 text-[15px] text-secondary">{explorerCopy.empty}</p>
            {filters.type === 'recently-published' ? (
              <p className="m-0 text-[14px] text-muted">{explorerCopy.emptyNew}</p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
