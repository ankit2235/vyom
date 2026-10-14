'use client';

import { useEffect, useState } from 'react';
import { consolePage } from '@/content/platformApp';
import { Button, Card, Chip, SampleDataChip } from '@/components/ui';

type Decision = 'accept' | 'correct' | 'escalate' | null;

export function ConsoleWorkbench() {
  const [decision, setDecision] = useState<Decision>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === 'a') setDecision('accept');
      if (key === 'c') setDecision('correct');
      if (key === 'e') setDecision('escalate');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const status =
    decision === 'accept'
      ? consolePage.statusAccept
      : decision === 'correct'
        ? consolePage.statusCorrect
        : decision === 'escalate'
          ? consolePage.statusEscalate
          : consolePage.statusIdle;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {consolePage.shortcuts.map((shortcut) => (
          <Chip key={shortcut.key} tone={shortcut.tone}>
            [{shortcut.key}] {shortcut.label}
          </Chip>
        ))}
        <SampleDataChip />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex min-h-[320px] flex-col gap-4 p-6">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{consolePage.documentLabel}</span>
          <h2 className="m-0 text-[18px] font-semibold text-primary">{consolePage.documentTitle}</h2>
          {consolePage.documentBody.map((paragraph) => (
            <p key={paragraph} className="m-0 text-[15px] leading-[1.65] text-secondary">
              {paragraph}
            </p>
          ))}
        </Card>

        <Card tone="amber" className="flex min-h-[320px] flex-col gap-4 p-6">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{consolePage.findingLabel}</span>
          <p className="m-0 text-[16px] leading-[1.6] text-primary">{consolePage.finding}</p>
          <p className="m-0 text-[14px] text-amber">{status}</p>
          <div className="mt-auto flex flex-wrap gap-2">
            <Button variant="panelPrimary" onClick={() => setDecision('accept')}>
              [A] Accept
            </Button>
            <Button variant="panel" onClick={() => setDecision('correct')}>
              [C] Correct
            </Button>
            <Button variant="panel" onClick={() => setDecision('escalate')}>
              [E] Escalate
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
