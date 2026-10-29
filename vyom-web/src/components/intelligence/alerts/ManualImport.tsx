'use client';

import { useId, useState, type ChangeEvent } from 'react';
import { importCopy } from '@/content/intelligence/alertsCopy';
import { Button, Chip, ScrollableTable } from '@/components/ui';
import { parseImport, type ImportedAlert } from '@/lib/intelligence/importAlerts';

const th = 'border-b border-line px-3 py-2.5 font-mono text-[11px] font-normal tracking-[0.1em] text-meta uppercase';
const td = 'border-b border-hairline px-3 py-3 text-[13.5px] leading-[1.45] text-secondary';

/**
 * Manual import. Rows live only in this component's state: they are never
 * written to storage or sent anywhere, and vanish on reload.
 */
export function ManualImport() {
  const [text, setText] = useState('');
  const [rows, setRows] = useState<readonly ImportedAlert[]>([]);
  const [errors, setErrors] = useState<readonly string[]>([]);
  const [status, setStatus] = useState('');
  const id = useId();

  function run(input: string) {
    const result = parseImport(input);
    setRows((current) => [...current, ...result.rows]);
    setErrors(result.errors);
    setStatus(importCopy.imported(result.rows.length));
  }

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) run(await file.text());
    event.target.value = '';
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([importCopy.templateCsv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = importCopy.templateName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-5 rounded-panel border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="m-0 text-[22px] font-semibold text-primary">{importCopy.heading}</h2>
        <p className="m-0 max-w-[760px] text-[14.5px] leading-[1.55] text-muted">{importCopy.lead}</p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-file`} className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">
            {importCopy.fileLabel}
          </label>
          <input
            id={`${id}-file`}
            type="file"
            accept=".csv,.json,text/csv,application/json"
            onChange={onFile}
            className="text-[13.5px] text-secondary file:mr-3 file:min-h-[40px] file:cursor-pointer file:rounded-control file:border file:border-button file:bg-transparent file:px-3 file:text-[13.5px] file:text-primary"
          />
        </div>
        <Button variant="panel" onClick={downloadTemplate}>
          {importCopy.template}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-paste`} className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">
          {importCopy.pasteLabel}
        </label>
        <textarea
          id={`${id}-paste`}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={importCopy.pastePlaceholder}
          rows={5}
          className="w-full rounded-control border border-button bg-panel px-3 py-2.5 font-mono text-[12.5px] text-primary placeholder:text-meta"
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="panelPrimary" onClick={() => run(text)}>
            {importCopy.import}
          </Button>
          {rows.length > 0 ? (
            <Button
              variant="panel"
              onClick={() => {
                setRows([]);
                setErrors([]);
                setStatus('');
              }}
            >
              {importCopy.clear}
            </Button>
          ) : null}
        </div>
      </div>

      <p role="status" className="m-0 text-[13.5px] text-secondary">
        {status}
      </p>

      {errors.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-nested border border-dashed border-secondary p-4">
          <span className="font-mono text-[11px] tracking-[0.1em] text-primary">{importCopy.errorsLabel}</span>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {errors.map((error) => (
              <li key={error} className="text-[13.5px] text-secondary">
                {error}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Chip tone="dashed" size="xs" className="self-start">
            {importCopy.resultLabel}
          </Chip>
          <ScrollableTable label={importCopy.resultLabel}>
            <table className="w-full min-w-[1040px] border-collapse text-left">
              <thead>
                <tr>
                  {importCopy.headers.map((header) => (
                    <th key={header} scope="col" className={th}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.batch}-${index}`} className="align-top">
                    <th scope="row" className={`${td} font-medium text-primary`}>
                      {row.title}
                    </th>
                    <td className={td}>{row.authority}</td>
                    <td className={`${td} font-mono text-[12.5px]`}>{row.publishedOn}</td>
                    <td className={td}>{row.product}</td>
                    <td className={`${td} font-mono text-[12.5px] text-primary`}>{row.batch}</td>
                    <td className={td}>{row.issue}</td>
                    <td className={td}>{row.manufacturer || '—'}</td>
                    <td className={td}>{row.action || '—'}</td>
                    <td className={td}>
                      <a
                        href={row.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline decoration-strong underline-offset-4"
                      >
                        {importCopy.open}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableTable>
        </div>
      ) : null}
    </div>
  );
}
