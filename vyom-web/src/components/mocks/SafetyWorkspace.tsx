import { workspacePreview } from '@/content/home';
import { DashedCircleIcon, HalfCircleIcon, StepCheckIcon } from '@/components/icons';
import { Chip } from '@/components/ui';
import { cn } from '@/lib/cn';
import { MockPanel } from './MockPanel';

const { incoming, alert, timeline } = workspacePreview;
const safetyCase = workspacePreview.case;

type Actor = (typeof timeline.steps)[number]['actor'];

/** Blue = AI did it, amber = waiting on a person, dashed = not reached yet. */
function StepMarker({ actor }: { readonly actor: Actor }) {
  if (actor === 'human') return <HalfCircleIcon className="shrink-0 text-amber" />;
  if (actor === 'next') return <DashedCircleIcon className="shrink-0 text-dash" />;
  return (
    <span
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full border',
        actor === 'ai'
          ? 'border-accent-line bg-accent-tint text-accent'
          : 'border-strong bg-raised text-secondary',
      )}
    >
      <StepCheckIcon />
    </span>
  );
}

/**
 * The hero panel: one fictional workspace showing a case, incoming reports, a
 * product-quality alert and the audit timeline. The timeline steps appear in
 * sequence once, via CSS (`.case-step`), so this stays a server component.
 */
export function SafetyWorkspace() {
  return (
    <MockPanel
      title={workspacePreview.title}
      subtitle={workspacePreview.subtitle}
      footer={workspacePreview.footer.map((note) => (
        <span key={note} className="font-mono text-[11.5px] tracking-[0.08em] text-meta">
          {note}
        </span>
      ))}
      bodyClassName="flex flex-col gap-px bg-line"
    >
      <div className="flex flex-wrap gap-px">
        {/* The case */}
        <section
          aria-label={`${safetyCase.label} ${safetyCase.id}`}
          className="flex min-w-0 flex-[1.5_1_420px] flex-col gap-4 bg-panel px-[22px] py-5"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{safetyCase.label}</span>
            <span className="font-mono text-[12.5px] text-muted">{safetyCase.id}</span>
          </div>
          <span className="text-[16px] leading-[1.35] font-semibold text-primary">{safetyCase.title}</span>

          <dl className="m-0 flex flex-col">
            {safetyCase.fields.map((field, index) => (
              <div
                key={field.label}
                className={cn(
                  'flex flex-wrap items-center gap-x-3 gap-y-1 py-2',
                  index < safetyCase.fields.length - 1 && 'border-b border-hairline',
                )}
              >
                <dt className="flex-[0_0_104px] font-mono text-[11px] tracking-[0.08em] text-meta">
                  {field.label}
                </dt>
                <dd className="m-0 min-w-0 flex-[1_1_160px] text-[13.5px] text-secondary">{field.value}</dd>
                {field.state === 'linked' ? (
                  <Chip tone="accent" size="xs">
                    ↳ {field.source.toUpperCase()}
                  </Chip>
                ) : (
                  <Chip tone="dashed" size="xs">
                    {field.source.toUpperCase()}
                  </Chip>
                )}
              </div>
            ))}
          </dl>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 rounded-nested border border-amber-line bg-amber-soft px-4 py-3">
            <span className="flex items-center gap-2.5">
              <HalfCircleIcon className="shrink-0 text-amber" />
              <span className="text-[14px] font-semibold text-primary">{safetyCase.review.label}</span>
              <span className="text-[13px] text-muted">{safetyCase.review.detail}</span>
            </span>
            <span className="font-mono text-[11px] tracking-[0.08em] text-meta">{safetyCase.evidence}</span>
          </div>
        </section>

        {/* Incoming reports and the quality alert */}
        <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-px">
          <section aria-label={incoming.label} className="flex flex-col gap-3 bg-panel px-[22px] py-5">
            <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{incoming.label}</span>
            <ul className="m-0 flex list-none flex-col p-0">
              {incoming.rows.map((row, index) => (
                <li
                  key={row.id}
                  className={cn(
                    'flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-2.5',
                    index < incoming.rows.length - 1 && 'border-b border-hairline',
                  )}
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-mono text-[12.5px] text-primary">{row.id}</span>
                    <span className="text-[13px] text-muted">{row.source}</span>
                  </span>
                  <Chip tone={row.tone === 'accent' ? 'accent' : 'default'} size="xs">
                    {row.status}
                  </Chip>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label={alert.label} className="flex flex-1 flex-col gap-2.5 bg-panel px-[22px] py-5">
            <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{alert.label}</span>
            <span className="text-[14.5px] leading-[1.4] font-semibold text-primary">{alert.title}</span>
            <p className="m-0 text-[13px] leading-[1.55] text-muted">{alert.body}</p>
            <div>
              <Chip tone="dashed" size="xs">
                {alert.status}
              </Chip>
            </div>
          </section>
        </div>
      </div>

      {/* Audit timeline */}
      <section aria-label={timeline.label} className="flex flex-col gap-3.5 bg-panel px-[22px] py-5">
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{timeline.label}</span>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-x-4 gap-y-4 p-0">
          {timeline.steps.map((step, index) => (
            <li
              key={step.name}
              style={{ '--step-index': index } as React.CSSProperties}
              className="case-step flex items-start gap-2.5"
            >
              <StepMarker actor={step.actor} />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span
                  className={cn(
                    'font-mono text-[11px] tracking-[0.08em]',
                    step.actor === 'human' ? 'text-amber' : 'text-meta',
                  )}
                >
                  {step.time}
                </span>
                <span className="text-[13.5px] font-semibold text-primary">{step.name}</span>
                <span className="text-[12.5px] leading-[1.45] text-muted">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </MockPanel>
  );
}
