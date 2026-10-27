/**
 * Builds the evidence-linked investigation report as Markdown. Pure: the same
 * record and date always give the same text, and every line that states a
 * fact carries its evidence label and numbered sources.
 */

import {
  basisLabel,
  caseSections,
  exportCopy,
  graphCopy,
  linkStatusLabel,
  markerLabel,
  statementBuckets,
  statusLabel,
} from '@/content/intelligence/dashboard';
import { getSource } from '@/content/intelligence/sources';
import type { IntelRecord, IsoDate, Statement } from '@/content/intelligence/types';
import { formatDate } from './records';

const label = (id: string) => caseSections.find((section) => section.id === id)?.label ?? id;

export function buildReport(record: IntelRecord, exportedOn: IsoDate): string {
  const order = record.sourceIds;
  const refs = (ids: readonly string[]) => (ids.length ? ids.map((id) => `[${order.indexOf(id) + 1}]`).join('') : '(no source)');
  const line = (s: Statement) => `- ${s.text} — *${basisLabel[s.basis]}* ${refs(s.sourceIds)}`;
  const section = (title: string, lines: readonly string[]) => (lines.length ? ['', `## ${title}`, '', ...lines] : []);
  const ws = record.workspace;
  const graphName = (id: string) => ws?.graph.nodes.find((node) => node.id === id)?.label ?? id;

  return [
    `# ${record.title}`,
    '',
    `${exportCopy.heading} · ${exportCopy.exported} ${formatDate(exportedOn)}`,
    '',
    `Status: ${record.statuses.map((s) => statusLabel[s]).join(' · ')}`,
    '',
    `> ${exportCopy.disclaimer}`,
    '',
    record.summary,
    ...section(label('verified'), record.statements.filter((s) => (statementBuckets.verified.bases as readonly string[]).includes(s.basis)).map(line)),
    ...section(label('reported'), record.statements.filter((s) => s.basis === 'reported').map(line)),
    ...section(label('unknown'), record.statements.filter((s) => s.basis === 'not-established').map(line)),
    ...section(label('health'), (record.healthConcerns ?? []).map(line)),
    ...section(label('actions'), (record.actions ?? []).map(line)),
    ...section(
      label('timeline'),
      (record.timeline ?? []).map((e) => `- **${e.dateLabel}** — ${e.title}${e.detail ? `. ${e.detail}` : ''} — *${basisLabel[e.basis]}* ${refs(e.sourceIds)}`),
    ),
    ...section(
      label('batches'),
      [
        ...(record.scopeNote ? [`> ${record.scopeNote}`, ''] : []),
        ...record.products.flatMap((p) =>
          p.batches.length
            ? p.batches.map((b) => `- ${p.name}: batch ${b.batch}${b.finding ? ` — ${b.finding}` : ''} — *${basisLabel[b.basis]}* ${refs(b.sourceIds)}`)
            : [`- ${p.name}: ${p.batchNote ?? ''}`],
        ),
      ],
    ),
    ...section(
      label('graph'),
      (ws?.graph.edges ?? []).map((e) => `- ${graphName(e.from)} → ${graphName(e.to)} — *${graphCopy.edge[e.status]}*: ${e.note} ${refs(e.sourceIds)}`),
    ),
    ...section(
      label('distribution'),
      (ws?.distribution ?? []).map((d) => `- ${d.from} → ${d.to}: ${d.item}${d.quantity ? `, ${d.quantity}` : ''} — *${linkStatusLabel[d.status]}* ${refs(d.sourceIds)}`),
    ),
    ...section(
      label('map'),
      (ws?.map.places ?? []).map((p) => `- ${p.name}, ${p.region} — *${markerLabel[p.state]}*: ${p.role}. ${p.batchEvidence} ${refs(p.evidence.flatMap((e) => e.sourceIds).filter((id, i, all) => all.indexOf(id) === i))}`),
    ),
    ...section(label('gaps'), record.gaps.map((gap) => `- ${gap}`)),
    ...section(
      label('sources'),
      order.map((id, i) => {
        const s = getSource(id);
        return `${i + 1}. ${s.outlet}, “${s.title}”, ${formatDate(s.publishedOn)}. Read ${formatDate(s.retrievedOn)}. ${s.url}`;
      }),
    ),
    '',
  ].join('\n');
}
