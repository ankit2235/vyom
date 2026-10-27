'use client';

import { useState } from 'react';
import { mapCopy, markerLabel } from '@/content/intelligence/dashboard';
import type { MarkerState, Workspace } from '@/content/intelligence/types';
import { cn } from '@/lib/cn';
import { StatementList } from './shared';

/** Map frame, in degrees. Wide enough for every sourced place with a margin. */
const bounds = { lonMin: 71.5, lonMax: 79, latMin: 24, latMax: 32.5 };
/** Longitude is shortened by cos(latitude) so distances read roughly true. */
const aspect =
  ((bounds.lonMax - bounds.lonMin) * Math.cos((((bounds.latMin + bounds.latMax) / 2) * Math.PI) / 180)) /
  (bounds.latMax - bounds.latMin);

const left = (lon: number) => ((lon - bounds.lonMin) / (bounds.lonMax - bounds.lonMin)) * 100;
const top = (lat: number) => ((bounds.latMax - lat) / (bounds.latMax - bounds.latMin)) * 100;

const exposureStates: readonly MarkerState[] = [
  'verified-batch',
  'reported-distribution',
  'potential-exposure',
  'investigation-pending',
  'not-established',
  'ruled-out',
];
const otherStates: readonly MarkerState[] = ['investigation-site', 'supply-origin'];

/**
 * One glyph per marker state. Shape carries the meaning, so the map never
 * borrows the accent (AI) or amber (human decision) colours.
 */
export function MarkerGlyph({ state, size = 18 }: { readonly state: MarkerState; readonly size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="shrink-0 text-primary">
      {state === 'verified-batch' ? <circle cx="10" cy="10" r="6.5" fill="currentColor" /> : null}
      {state === 'reported-distribution' ? (
        <>
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10" cy="10" r="4" fill="currentColor" />
        </>
      ) : null}
      {state === 'potential-exposure' ? (
        <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.6 2.4" />
      ) : null}
      {state === 'investigation-pending' ? (
        <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
      ) : null}
      {state === 'not-established' ? (
        <>
          <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 15L15 5" stroke="currentColor" strokeWidth="1.6" />
        </>
      ) : null}
      {state === 'ruled-out' ? <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" /> : null}
      {state === 'investigation-site' ? (
        <rect x="4.5" y="4.5" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(45 10 10)" />
      ) : null}
      {state === 'supply-origin' ? (
        <path d="M10 3.5l7 12.5H3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      ) : null}
    </svg>
  );
}

export function InvestigationMap({
  map,
  order,
}: {
  readonly map: Workspace['map'];
  readonly order: readonly string[];
}) {
  const [selectedId, setSelectedId] = useState(map.places[0]?.id ?? '');
  const selected = map.places.find((place) => place.id === selectedId);
  const count = (state: MarkerState) => map.places.filter((place) => place.state === state).length;

  const lonLines = Array.from({ length: Math.floor(bounds.lonMax) - Math.ceil(bounds.lonMin) + 1 }, (_, i) => Math.ceil(bounds.lonMin) + i);
  const latLines = Array.from({ length: Math.floor(bounds.latMax) - Math.ceil(bounds.latMin) + 1 }, (_, i) => Math.ceil(bounds.latMin) + i);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start gap-5">
        {/* The map */}
        <div className="flex min-w-0 flex-[1.2_1_340px] flex-col gap-2">
          <div
            className="relative w-full overflow-hidden rounded-card border border-line bg-panel"
            style={{ aspectRatio: aspect }}
          >
            <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {lonLines.map((lon) => (
                <line key={`lon-${lon}`} x1={left(lon)} x2={left(lon)} y1="0" y2="100" stroke="var(--color-hairline)" vectorEffect="non-scaling-stroke" />
              ))}
              {latLines.map((lat) => (
                <line key={`lat-${lat}`} y1={top(lat)} y2={top(lat)} x1="0" x2="100" stroke="var(--color-hairline)" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {lonLines
              .filter((lon) => lon % 2 === 0 && lon > bounds.lonMin && lon < bounds.lonMax)
              .map((lon) => (
                <span
                  key={`lonl-${lon}`}
                  aria-hidden="true"
                  className="absolute bottom-1 -translate-x-1/2 font-mono text-[10px] text-meta"
                  style={{ left: `${left(lon)}%` }}
                >
                  {lon}°E
                </span>
              ))}
            {latLines
              .filter((lat) => lat % 2 === 0 && lat > bounds.latMin && lat < bounds.latMax)
              .map((lat) => (
                <span
                  key={`latl-${lat}`}
                  aria-hidden="true"
                  className="absolute left-1.5 -translate-y-1/2 font-mono text-[10px] text-meta"
                  style={{ top: `${top(lat)}%` }}
                >
                  {lat}°N
                </span>
              ))}

            <ul className="m-0 list-none p-0">
              {map.places.map((place) => {
                const isSelected = place.id === selectedId;
                return (
                  <li
                    key={place.id}
                    className="absolute -translate-x-[9px] -translate-y-1/2"
                    style={{ left: `${left(place.lon)}%`, top: `${top(place.lat)}%` }}
                  >
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`${place.name}: ${markerLabel[place.state]}`}
                      onClick={() => setSelectedId(place.id)}
                      className={cn(
                        'flex min-h-[32px] items-center gap-1.5 rounded-control border py-1 pr-2 pl-1 text-[12.5px] whitespace-nowrap',
                        isSelected
                          ? 'border-primary bg-raised text-primary'
                          : 'border-transparent text-secondary hover:border-strong hover:bg-surface',
                      )}
                    >
                      <MarkerGlyph state={place.state} />
                      {place.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="m-0 text-[12.5px] leading-[1.5] text-meta">
            <span className="font-mono tracking-[0.08em]">{mapCopy.label}</span> · {mapCopy.note}
          </p>
        </div>

        {/* Detail panel */}
        <div aria-live="polite" className="flex min-w-0 flex-[1_1_300px] flex-col gap-4 rounded-card border border-line bg-surface p-5">
          {selected ? (
            <>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-[19px] font-semibold text-primary">
                  <MarkerGlyph state={selected.state} />
                  {selected.name}
                  <span className="text-[14px] font-normal text-muted">· {selected.region}</span>
                </span>
                <span className="font-mono text-[11.5px] tracking-[0.08em] text-secondary uppercase">
                  {markerLabel[selected.state]}
                </span>
              </div>
              <dl className="m-0 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <dt className="font-mono text-[11px] tracking-[0.1em] text-meta">{mapCopy.role}</dt>
                  <dd className="m-0 text-[14px] text-secondary">{selected.role}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="font-mono text-[11px] tracking-[0.1em] text-meta">{mapCopy.when}</dt>
                  <dd className="m-0 text-[14px] text-secondary">{selected.when}</dd>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <dt className="font-mono text-[11px] tracking-[0.1em] text-meta">{mapCopy.batch}</dt>
                  <dd className="m-0 text-[14px] leading-[1.5] text-secondary">{selected.batchEvidence}</dd>
                </div>
              </dl>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{mapCopy.evidence}</span>
                <StatementList statements={selected.evidence} order={order} />
              </div>
            </>
          ) : (
            <p className="m-0 text-[14px] text-muted">{mapCopy.prompt}</p>
          )}
        </div>
      </div>

      {/* Legend: every state, with how many places hold it, including none. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4">
        {[
          { title: mapCopy.exposure, states: exposureStates },
          { title: mapCopy.other, states: otherStates },
        ].map((group) => (
          <div key={group.title} className="flex flex-col gap-2.5">
            <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{group.title}</span>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {group.states.map((state) => (
                <li key={state} className="flex items-center gap-2.5 text-[13.5px] text-secondary">
                  <MarkerGlyph state={state} size={16} />
                  <span className="flex-1">{markerLabel[state]}</span>
                  <span className="font-mono text-[12px] text-meta">{count(state) || mapCopy.none}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {map.unplaced.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{mapCopy.unplaced}</span>
          <StatementList statements={map.unplaced} order={order} />
        </div>
      ) : null}
    </div>
  );
}
