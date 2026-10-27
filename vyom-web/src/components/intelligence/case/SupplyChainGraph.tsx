'use client';

import { useState } from 'react';
import { graphCopy } from '@/content/intelligence/dashboard';
import type { EdgeStatus, GraphEdge, GraphNode, GraphStage, Workspace } from '@/content/intelligence/types';
import { cn } from '@/lib/cn';
import { EdgeStatusChip } from '../EvidenceChip';
import { SourceRefs, StatementList } from './shared';

const stages = Object.keys(graphCopy.stages) as GraphStage[];

/*
 * Layout: one row per stage, top to bottom, and two lanes side by side.
 * Horizontal positions are percentages and vertical ones pixels, so the graph
 * fits any width without scrolling sideways.
 */
const ROW_H = 112;
const LABEL_H = 22;
const NODE_H = 76;
const NODE_W = 45; // % of the width
const HEIGHT = stages.length * ROW_H;
const laneLeft: Record<GraphNode['lane'], number> = { 0: 2, 0.5: 27.5, 1: 53 };

const nodeLeft = (node: GraphNode) => laneLeft[node.lane];
const nodeTop = (node: GraphNode) => stages.indexOf(node.stage) * ROW_H + LABEL_H;

/** Line style per status: solid when reported or verified, dotted when inferred, dashed when unverified. */
const dash: Record<EdgeStatus, string | undefined> = {
  verified: undefined,
  reported: undefined,
  inferred: '2 4',
  unverified: '6 5',
};

const edgeKey = (edge: GraphEdge) => `${edge.from}->${edge.to}`;

export function SupplyChainGraph({
  graph,
  order,
}: {
  readonly graph: Workspace['graph'];
  readonly order: readonly string[];
}) {
  const [nodeId, setNodeId] = useState<string | null>(null);
  const [edgeId, setEdgeId] = useState<string | null>(null);
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const node = nodeId ? byId.get(nodeId) : undefined;
  const touches = (edge: GraphEdge) => !nodeId || edge.from === nodeId || edge.to === nodeId;
  const listed = graph.edges.filter(touches);
  const name = (id: string) => byId.get(id)?.label ?? id;
  const counts = (status: EdgeStatus) => graph.edges.filter((edge) => edge.status === status).length;

  function selectNode(id: string) {
    setEdgeId(null);
    setNodeId((current) => (current === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="m-0 text-[14px] text-muted">{graphCopy.hint}</p>

      <div className="flex flex-wrap items-start gap-5">
        <div
          role="group"
          aria-label={graphCopy.graphLabel}
          className="relative min-w-0 flex-[1_1_360px] rounded-card border border-line bg-panel lg:max-w-[540px]"
          style={{ height: HEIGHT + 12 }}
        >
          {stages.map((stage, index) => (
            <span
              key={stage}
              className="absolute left-[2%] z-[1] bg-panel pr-1.5 font-mono text-[10.5px] tracking-[0.1em] text-meta uppercase"
              style={{ top: index * ROW_H + 6 }}
            >
              {graphCopy.stages[stage]}
            </span>
          ))}

          <svg
            aria-hidden="true"
            className="absolute inset-0 size-full"
            viewBox={`0 0 100 ${HEIGHT + 12}`}
            preserveAspectRatio="none"
          >
            {graph.edges.map((edge) => {
              const from = byId.get(edge.from);
              const to = byId.get(edge.to);
              if (!from || !to) return null;
              const x1 = nodeLeft(from) + NODE_W / 2;
              const y1 = nodeTop(from) + NODE_H;
              const x2 = nodeLeft(to) + NODE_W / 2;
              const y2 = nodeTop(to);
              const mid = (y1 + y2) / 2;
              const active = edgeId ? edgeKey(edge) === edgeId : touches(edge);
              return (
                <path
                  key={edgeKey(edge)}
                  d={`M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`}
                  fill="none"
                  stroke={active ? 'var(--color-primary)' : 'var(--color-strong)'}
                  strokeWidth={edgeId && active ? 2.2 : 1.4}
                  strokeDasharray={dash[edge.status]}
                  vectorEffect="non-scaling-stroke"
                  opacity={active ? 1 : 0.45}
                />
              );
            })}
          </svg>

          {graph.nodes.map((item) => {
            const selected = item.id === nodeId;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectNode(item.id)}
                className={cn(
                  'absolute flex flex-col items-start justify-center gap-1 rounded-nested border px-3 text-left',
                  item.known ? 'border-solid' : 'border-dashed',
                  selected ? 'border-primary bg-raised' : 'border-strong bg-surface hover:border-secondary',
                )}
                style={{ left: `${nodeLeft(item)}%`, top: nodeTop(item), width: `${NODE_W}%`, height: NODE_H }}
              >
                <span className="line-clamp-2 text-[13px] leading-[1.25] font-semibold text-primary">{item.label}</span>
                <span className="line-clamp-2 text-[11.5px] leading-[1.3] text-muted">{item.sub}</span>
              </button>
            );
          })}
        </div>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4">
          {/* Legend */}
          <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
            {(Object.keys(graphCopy.edge) as EdgeStatus[]).map((status) => (
              <li key={status} className="flex items-center gap-2.5 text-[13px] text-secondary" title={graphCopy.edgeHelp[status]}>
                <svg width="34" height="8" aria-hidden="true">
                  <line x1="0" y1="4" x2="34" y2="4" stroke="var(--color-secondary)" strokeWidth="1.6" strokeDasharray={dash[status]} />
                </svg>
                {graphCopy.edge[status]}
                <span className="font-mono text-[12px] text-meta">{counts(status)}</span>
              </li>
            ))}
          </ul>

          {node ? (
            <div className="flex min-w-0 flex-col gap-4 rounded-card border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-meta uppercase">{graphCopy.stages[node.stage]}</span>
                  <span className="text-[18px] font-semibold text-primary">{node.label}</span>
                  <span className="text-[13.5px] text-muted">{node.sub}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNodeId(null)}
                  className="min-h-[36px] shrink-0 rounded-control border border-line px-3 text-[13px] text-secondary hover:border-strong"
                >
                  {graphCopy.close}
                </button>
              </div>
              {!node.known ? (
                <span className="self-start rounded-chip border border-dashed border-dash px-2 py-1 font-mono text-[11px] tracking-[0.08em] text-muted">
                  {graphCopy.notNamed}
                </span>
              ) : null}
              {node.facts.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{graphCopy.facts}</span>
                  <StatementList statements={node.facts} order={order} />
                </div>
              ) : null}
              {node.quantities ? (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{graphCopy.quantities}</span>
                  <dl className="m-0 grid grid-cols-3 gap-px overflow-hidden rounded-nested border border-line bg-line">
                    {node.quantities.map((quantity) => (
                      <div key={quantity.label} className="flex flex-col gap-1 bg-panel px-3 py-2.5">
                        <dt className="text-[12px] text-muted">{quantity.label}</dt>
                        <dd className="m-0 flex flex-wrap items-center gap-1.5 text-[18px] font-semibold text-primary">
                          {quantity.value}
                          <SourceRefs ids={quantity.sourceIds} order={order} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              {node.conflicts && node.conflicts.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-primary">{graphCopy.conflicts}</span>
                  <ul className="m-0 flex list-none flex-col gap-1.5 rounded-nested border border-dashed border-secondary p-3">
                    {node.conflicts.map((conflict) => (
                      <li key={conflict} className="text-[13.5px] leading-[1.5] text-secondary">
                        {conflict}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{graphCopy.missing}</span>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {node.missing.map((item) => (
                    <li key={item} className="rounded-chip border border-dashed border-dash px-2 py-1 text-[13px] text-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
                {node ? graphCopy.forNode(node.label) : graphCopy.relationships}
              </span>
              {node ? (
                <button
                  type="button"
                  onClick={() => setNodeId(null)}
                  className="min-h-[36px] text-[13px] text-secondary underline underline-offset-4 hover:text-primary"
                >
                  {graphCopy.showAll}
                </button>
              ) : null}
            </div>
            <ul className="m-0 flex list-none flex-col gap-px overflow-hidden rounded-card border border-line bg-line p-0">
              {listed.map((edge) => {
                const key = edgeKey(edge);
                const selected = key === edgeId;
                return (
                  <li key={key} className={cn('flex flex-col gap-2 px-4 py-3', selected ? 'bg-raised' : 'bg-panel')}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setEdgeId(selected ? null : key)}
                      className="flex min-h-[32px] flex-wrap items-center gap-2 text-left text-[14px] font-medium text-primary hover:underline"
                    >
                      {name(edge.from)} <span aria-hidden="true" className="text-meta">→</span>
                      <span className="sr-only">to</span> {name(edge.to)}
                    </button>
                    <p className="m-0 text-[13.5px] leading-[1.5] text-muted">{edge.note}</p>
                    <span className="flex flex-wrap items-center gap-2">
                      <EdgeStatusChip status={edge.status} />
                      {edge.sourceIds.length > 0 ? (
                        <SourceRefs ids={edge.sourceIds} order={order} />
                      ) : (
                        <span className="text-[12.5px] text-meta">{graphCopy.noSource}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <p className="m-0 text-[13px] leading-[1.5] text-meta">{graphCopy.rule}</p>
    </div>
  );
}
