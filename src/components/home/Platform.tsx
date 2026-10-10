import { platformSection } from '@/content/home';
import { ArrowRightIcon, assuranceIcons } from '@/components/icons';
import { Eyebrow, Section } from '@/components/ui';
import { cn } from '@/lib/cn';

export function Platform() {
  return (
    <Section id="platform">
      <div className="flex flex-col gap-14">
        <div data-reveal className="flex max-w-[760px] flex-col gap-4">
          <Eyebrow>{platformSection.eyebrow}</Eyebrow>
          <h2 className="m-0 text-[clamp(32px,3.3vw,46px)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-primary">
            {platformSection.heading}
          </h2>
          <p className="m-0 text-[18px] leading-[1.6] text-pretty text-muted">
            {platformSection.lead}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <ol data-reveal className="m-0 flex list-none flex-wrap gap-4 p-0">
            {platformSection.steps.map((step, index) => (
              <li
                key={step.title}
                className={cn(
                  'flex min-w-0 flex-[1_1_200px] flex-col gap-3.5 rounded-card border bg-surface p-6',
                  step.tone === 'accent'
                    ? 'border-accent-line'
                    : step.tone === 'amber'
                      ? 'border-amber-line'
                      : 'border-line',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'font-mono text-[12px] font-medium tracking-[0.1em]',
                      step.tone === 'accent'
                        ? 'text-accent'
                        : step.tone === 'amber'
                          ? 'text-amber'
                          : 'text-meta',
                    )}
                  >
                    {step.index}
                  </span>
                  {index < platformSection.steps.length - 1 ? (
                    <ArrowRightIcon size={16} className="text-dash" />
                  ) : null}
                </div>
                <span className="text-[19px] font-semibold text-primary">{step.title}</span>
                <p className="m-0 text-[15px] leading-[1.6] text-muted">{step.body}</p>
              </li>
            ))}
          </ol>

          <ul
            data-reveal
            className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-px overflow-hidden rounded-card border border-line bg-line p-0"
          >
            {platformSection.assurances.map((assurance) => {
              const Icon = assuranceIcons[assurance.icon];
              return (
                <li
                  key={assurance.text}
                  className="flex items-center gap-3.5 bg-alt px-[22px] py-5"
                >
                  <span className="flex shrink-0 text-accent">
                    <Icon />
                  </span>
                  <span className="text-[14.5px] leading-[1.5] text-secondary">
                    {assurance.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
