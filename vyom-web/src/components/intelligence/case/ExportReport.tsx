'use client';

import { exportCopy } from '@/content/intelligence/dashboard';
import type { IntelRecord } from '@/content/intelligence/types';
import { Button } from '@/components/ui';
import { buildReport } from '@/lib/intelligence/report';

/** Downloads the evidence report as a Markdown file. Built in the browser; nothing is sent anywhere. */
export function ExportReport({ record }: { readonly record: IntelRecord }) {
  function download() {
    const today = new Date().toISOString().slice(0, 10);
    const blob = new Blob([buildReport(record, today)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportCopy.filename(record.slug);
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <Button variant="secondary" onClick={download}>
        {exportCopy.button}
      </Button>
      <span className="text-[13px] text-meta">{exportCopy.note}</span>
    </div>
  );
}
