/**
 * The scripted evidence assistant. Each answer is assembled by fixed rules
 * from one record, the other records and the official alerts — nothing is
 * generated, and nothing is said that the data does not hold. When the data
 * cannot settle a question, the verdict is `cannot`.
 */

import { alerts } from '@/content/intelligence/alerts';
import { answerCopy, intentPatterns, type Intent } from '@/content/intelligence/assistant';
import { graphCopy, markerLabel } from '@/content/intelligence/dashboard';
import { records } from '@/content/intelligence/records';
import { getSource } from '@/content/intelligence/sources';
import type { IntelRecord, OfficialAlert, Statement } from '@/content/intelligence/types';
import { formatDate, lastRead } from './records';

export type AnswerPart = {
  readonly text: string;
  readonly sourceIds?: readonly string[];
  readonly alert?: { readonly id: string; readonly title: string; readonly sNo: number };
};

export type Answer = {
  readonly verdict: 'answered' | 'cannot' | 'out-of-scope';
  readonly parts: readonly AnswerPart[];
};

export function routeQuestion(question: string): Intent {
  return intentPatterns.find(({ pattern }) => pattern.test(question))?.intent ?? 'unknown';
}

const fromStatement = (s: Statement): AnswerPart => ({ text: s.text, sourceIds: s.sourceIds });
const unique = <T,>(items: readonly T[]) => items.filter((item, i) => items.indexOf(item) === i);

/**
 * Whole-word match, so "TOCIN" never matches inside "oxytocin": a product
 * name must not be mistaken for an ingredient or another product.
 */
function hasWord(text: string, word: string): boolean {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i').test(text);
}

/** "M/s. Jackson Laboratories Pvt.Ltd., Amritsar" → "jackson laboratories". */
function companyKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/m\/s\.?/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(' ');
}

function sameProduct(record: IntelRecord): Answer {
  const { sameProduct: copy } = answerCopy;
  const names = record.products.map((p) => p.name.toLowerCase());
  const ingredients = unique(record.products.flatMap((p) => p.activeIngredients.map((i) => i.toLowerCase())));
  const makers = record.parties.filter((p) => p.role === 'manufacturer').map((p) => companyKey(p.name));
  const parts: AnswerPart[] = [];

  for (const other of records) {
    if (other.slug === record.slug) continue;
    const otherNames = other.products.map((p) => p.name.toLowerCase());
    const otherIngredients = other.products.flatMap((p) => p.activeIngredients.map((i) => i.toLowerCase()));
    const otherMakers = other.parties.filter((p) => p.role === 'manufacturer').map((p) => companyKey(p.name));
    const reason = names.some((n) => otherNames.includes(n))
      ? copy.reasons.product
      : ingredients.some((i) => otherIngredients.includes(i))
        ? copy.reasons.ingredient
        : makers.some((m) => otherMakers.includes(m))
          ? copy.reasons.manufacturer
          : null;
    if (reason) parts.push({ text: copy.record(other.title, reason), sourceIds: [] });
  }

  for (const alert of alerts as readonly OfficialAlert[]) {
    for (const row of alert.rows) {
      const product = row.product.toLowerCase();
      const maker = row.manufacturer.toLowerCase();
      const reason = names.some((n) => hasWord(product, n))
        ? copy.reasons.product
        : ingredients.some((i) => hasWord(product, i))
          ? copy.reasons.ingredient
          : makers.some((m) => m && hasWord(maker, m))
            ? copy.reasons.manufacturer
            : null;
      if (reason) {
        parts.push({
          text: copy.alertRow(row.product, row.batch, reason),
          alert: { id: alert.id, title: alert.title, sNo: row.sNo },
        });
      }
    }
  }

  if (parts.length === 0) return { verdict: 'answered', parts: [{ text: copy.none }] };
  return { verdict: 'answered', parts: [...parts, { text: copy.notLinked }] };
}

export function answer(intent: Intent, record: IntelRecord): Answer {
  const ws = record.workspace;

  switch (intent) {
    case 'batch': {
      const copy = answerCopy.batch;
      const batches = record.products.flatMap((p) => p.batches.map((b) => ({ product: p.name, ...b })));
      if (batches.length === 0) {
        return {
          verdict: 'cannot',
          parts: [
            { text: copy.none },
            ...(ws?.batchLanes ?? []).map((lane) => ({
              text: copy.lane(lane.label),
              sourceIds: unique(lane.facts.flatMap((f) => f.sourceIds)),
            })),
          ],
        };
      }
      const inAlerts = batches.flatMap((b) =>
        (alerts as readonly OfficialAlert[]).flatMap((alert) =>
          alert.rows
            .filter((row) => row.batch === b.batch)
            .map((row) => ({ text: copy.inAlert(b.batch, alert.title), alert: { id: alert.id, title: alert.title, sNo: row.sNo } })),
        ),
      );
      return {
        verdict: 'answered',
        parts: [
          ...batches.map((b) => ({
            text: copy.listed(b.product, b.batch, getSource(b.sourceIds[0] ?? '').outlet),
            sourceIds: b.sourceIds,
          })),
          ...(inAlerts.length > 0 ? inAlerts : [{ text: copy.notInAlerts }]),
          { text: copy.noDistribution },
        ],
      };
    }

    case 'distribution': {
      const copy = answerCopy.distribution;
      if (!ws) {
        return { verdict: 'cannot', parts: [{ text: copy.noMap }, ...(record.location.note ? [{ text: record.location.note }] : [])] };
      }
      const verified = ws.map.places.filter((p) => p.state === 'verified-batch');
      const reported = ws.map.places.filter((p) => p.state === 'reported-distribution');
      if (verified.length > 0) {
        return {
          verdict: 'answered',
          parts: verified.map((p) => ({ text: `${p.name}: ${markerLabel[p.state]}`, sourceIds: unique(p.evidence.flatMap((e) => e.sourceIds)) })),
        };
      }
      return {
        verdict: 'cannot',
        parts: [
          { text: copy.none },
          ...reported.map((p) => ({ text: copy.reported(p.name, p.batchEvidence), sourceIds: unique(p.evidence.flatMap((e) => e.sourceIds)) })),
        ],
      };
    }

    case 'same-product':
      return sameProduct(record);

    case 'relationship': {
      const copy = answerCopy.relationship;
      if (ws) {
        const statuses = ['verified', 'reported', 'inferred', 'unverified'] as const;
        const counts = statuses.map((s) => `${ws.graph.edges.filter((e) => e.status === s).length} ${graphCopy.edge[s].toLowerCase()}`).join(', ');
        const name = (id: string) => ws.graph.nodes.find((n) => n.id === id)?.label ?? id;
        return {
          verdict: 'answered',
          parts: [
            { text: copy.summary(ws.graph.edges.length, counts) },
            ...ws.graph.edges.map((e) => ({ text: copy.edge(name(e.from), name(e.to), graphCopy.edge[e.status], e.note), sourceIds: e.sourceIds })),
          ],
        };
      }
      const ties = record.products.flatMap((p) =>
        p.batches.map((b) => {
          const maker = record.parties.find((party) => party.role === 'manufacturer' && party.note?.includes(b.batch));
          return { text: copy.batchTie(p.name, b.batch, maker?.name ?? '—'), sourceIds: b.sourceIds };
        }),
      );
      return ties.length > 0 ? { verdict: 'answered', parts: ties } : { verdict: 'cannot', parts: [{ text: copy.none }] };
    }

    case 'unverified': {
      const copy = answerCopy.unverified;
      const all = [...record.statements, ...(record.healthConcerns ?? []), ...(record.actions ?? [])];
      const weak = all.filter((s) => s.basis === 'reported' || s.basis === 'not-established');
      const weakEdges = ws?.graph.edges.filter((e) => e.status === 'unverified' || e.status === 'inferred').length ?? 0;
      if (weak.length === 0 && weakEdges === 0) return { verdict: 'answered', parts: [{ text: copy.none }] };
      const shown = weak.slice(0, 6);
      return {
        verdict: 'answered',
        parts: [
          ...(weak.length > 0 ? [{ text: copy.summary(weak.length) }, ...shown.map(fromStatement)] : []),
          ...(weak.length > shown.length ? [{ text: copy.more(weak.length - shown.length) }] : []),
          ...(weakEdges > 0 ? [{ text: copy.edges(weakEdges) }] : []),
        ],
      };
    }

    case 'missing': {
      const copy = answerCopy.missing;
      const docs = unique(ws?.graph.nodes.flatMap((n) => n.missing) ?? []);
      return {
        verdict: 'answered',
        parts: [
          ...(docs.length > 0 ? [{ text: copy.summary }, ...docs.map((d) => ({ text: d }))] : []),
          { text: copy.gaps },
          ...record.gaps.map((g) => ({ text: g })),
        ],
      };
    }

    case 'changes': {
      const copy = answerCopy.changes;
      const corrections = record.history.filter((h) => h.kind === 'correction');
      return {
        verdict: 'cannot',
        parts: [
          { text: copy.once(formatDate(lastRead([record]))) },
          ...(corrections.length > 0 ? [{ text: copy.corrections }, ...corrections.map((c) => ({ text: c.change }))] : []),
        ],
      };
    }

    case 'regulatory': {
      const events = (record.timeline ?? []).filter((e) => e.kind === 'regulatory');
      const parts: AnswerPart[] = [
        ...events.map((e) => ({ text: `${e.dateLabel} — ${e.title}.`, sourceIds: e.sourceIds })),
        ...(record.actions ?? []).map(fromStatement),
      ];
      return parts.length > 0
        ? { verdict: 'answered', parts }
        : { verdict: 'cannot', parts: [{ text: answerCopy.regulatory.none }] };
    }

    case 'causality': {
      const copy = answerCopy.causality;
      const findings = record.statements.filter((s) => s.basis === 'not-established');
      return {
        verdict: 'cannot',
        parts: [{ text: copy.lead }, ...(findings.length > 0 ? findings.map(fromStatement) : [{ text: copy.noStatement }])],
      };
    }

    case 'clinical':
      return { verdict: 'out-of-scope', parts: [{ text: answerCopy.clinical }] };

    case 'unknown':
      return { verdict: 'out-of-scope', parts: [{ text: answerCopy.unknown }] };
  }
}
