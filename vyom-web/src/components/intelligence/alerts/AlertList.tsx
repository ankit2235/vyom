'use client';

import { useId, useState } from 'react';
import { alertCopy, alertKindHelp, alertKindLabel } from '@/content/intelligence/alertsCopy';
import type { OfficialAlert } from '@/content/intelligence/types';
import { Chip, ScrollableTable } from '@/components/ui';
import { formatDate } from '@/lib/intelligence/records';
import { PublicSourceChip } from '../EvidenceChip';

const th = 'border-b border-line px-3 py-2.5 font-mono text-[11px] font-normal tracking-[0.1em] text-meta uppercase';
const td = 'border-b border-hairline px-3 py-3 text-[13.5px] leading-[1.45] text-secondary';

/** Every alert in full (or as a labelled excerpt), with one search over all rows. */
export function AlertList({ alerts }: { readonly alerts: readonly OfficialAlert[] }) {
  const [query, setQuery] = useState('');
  const id = useId();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (row: OfficialAlert['rows'][number]) =>
    terms.every((term) => [row.product, row.batch, row.manufacturer, row.reason, row.reportedBy].join(' ').toLowerCase().includes(term));
  const total = alerts.reduce((sum, alert) => sum + alert.rows.filter(matches).length, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2 sm:max-w-[420px]">
          <label htmlFor={`${id}-q`} className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">
            {alertCopy.searchLabel}
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={alertCopy.searchPlaceholder}
            className="min-h-[44px] w-full rounded-control border border-button bg-panel px-3 text-[14.5px] text-primary placeholder:text-meta"
          />
        </div>
        <p role="status" className="m-0 font-mono text-[12px] tracking-[0.06em] text-meta">
          {alertCopy.showing(total)}
        </p>
      </div>

      {alerts.map((alert) => {
        const rows = alert.rows.filter(matches);
        if (terms.length > 0 && rows.length === 0) return null;
        return (
          <article key={alert.id} id={alert.id} className="flex scroll-mt-24 flex-col gap-4 rounded-panel border border-line bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <PublicSourceChip />
              <Chip tone="default" size="sm" className="text-primary">
                {alertKindLabel[alert.kind].toUpperCase()}
              </Chip>
            </div>
            <h3 className="m-0 text-[20px] leading-[1.3] font-semibold text-primary">{alert.title}</h3>
            <p className="m-0 text-[13.5px] leading-[1.5] text-meta">{alertKindHelp[alert.kind]}</p>

            <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-px overflow-hidden rounded-nested border border-line bg-line">
              {[
                [alertCopy.authority, alert.authority],
                [alertCopy.released, formatDate(alert.publishedOn)],
                [alertCopy.rows, alertCopy.rowsShown(alert.rows.length, alert.totalRows)],
              ].map(([term, value]) => (
                <div key={term} className="flex flex-col gap-1 bg-panel px-4 py-3">
                  <dt className="font-mono text-[11px] tracking-[0.1em] text-meta">{term}</dt>
                  <dd className="m-0 text-[14px] text-primary">{value}</dd>
                </div>
              ))}
            </dl>

            {alert.excerpt ? (
              <p className="m-0 rounded-nested border border-dashed border-secondary px-4 py-3 text-[14px] leading-[1.5] font-medium text-primary">
                {alert.excerpt}
              </p>
            ) : null}

            <ScrollableTable label={alert.title}>
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr>
                    {alertCopy.headers.map((header) => (
                      <th key={header} scope="col" className={th}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.sNo} id={`${alert.id}-row-${row.sNo}`} className="scroll-mt-24 align-top target:bg-raised">
                      <td className={`${td} font-mono text-[12.5px]`}>{row.sNo}</td>
                      <th scope="row" className={`${td} font-medium text-primary`}>
                        {row.product}
                      </th>
                      <td className={`${td} font-mono text-[12.5px] whitespace-nowrap text-primary`}>{row.batch}</td>
                      <td className={`${td} font-mono text-[12.5px] whitespace-nowrap`}>{row.manufactured}</td>
                      <td className={`${td} font-mono text-[12.5px] whitespace-nowrap`}>{row.expiry}</td>
                      <td className={td}>{row.manufacturer}</td>
                      <td className={td}>{row.reason}</td>
                      <td className={td}>{row.reportedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollableTable>

            {alert.rowNote ? (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{alertCopy.rowNote}</span>
                <p className="m-0 text-[13.5px] leading-[1.5] text-secondary">{alert.rowNote}</p>
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{alertCopy.action}</span>
              <p className="m-0 text-[13.5px] leading-[1.5] text-secondary">{alert.action}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-[13.5px]">
              <a
                href={alert.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[32px] items-center text-primary underline decoration-strong underline-offset-4 hover:decoration-secondary"
              >
                {alertCopy.document}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a
                href={alert.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[32px] items-center text-secondary underline decoration-strong underline-offset-4 hover:text-primary"
              >
                {alertCopy.listing}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <span className="text-meta">
                {alertCopy.readOn} {formatDate(alert.retrievedOn)}
              </span>
            </div>
          </article>
        );
      })}

      {terms.length > 0 && total === 0 ? (
        <p className="m-0 rounded-panel border border-dashed border-dash px-6 py-8 text-center text-[15px] text-secondary">
          {alertCopy.noMatch}
        </p>
      ) : null}
    </div>
  );
}
