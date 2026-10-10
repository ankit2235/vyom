import { problem } from '@/content/home';
import { Eyebrow, Section, StatCard } from '@/components/ui';

export function Problem() {
  return (
    <Section>
      <div
        data-reveal
        className="flex flex-wrap items-start gap-x-16 gap-y-14"
      >
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <h2 className="m-0 text-[clamp(32px,3.3vw,46px)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-primary">
            {problem.heading}
          </h2>
          <p className="m-0 text-[18px] leading-[1.6] text-pretty text-muted">{problem.lead}</p>
          <p className="m-0 border-t border-line pt-5 text-[19px] leading-[1.5] font-medium text-pretty text-primary">
            {problem.statement}
          </p>
        </div>

        <div className="grid min-w-0 flex-[1.6_1_560px] grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4">
          {problem.stats.map((stat) => (
            <StatCard key={stat.value + stat.label} {...stat} />
          ))}
        </div>
      </div>
    </Section>
  );
}
