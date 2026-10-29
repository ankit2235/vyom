import { problem } from '@/content/home';
import { problemIcons } from '@/components/icons';
import { Eyebrow, Section, StatCard } from '@/components/ui';

export function Problem() {
  return (
    <Section>
      <div className="flex flex-col gap-14">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <div className="flex min-w-0 flex-[1.4_1_640px] flex-col gap-4">
            <Eyebrow>{problem.eyebrow}</Eyebrow>
            <h2 className="m-0 text-[clamp(32px,3.3vw,46px)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-primary">
              {problem.heading}
            </h2>
          </div>
          <p className="m-0 max-w-[420px] flex-[1_1_320px] text-[18px] leading-[1.6] text-pretty text-muted">
            {problem.lead}
          </p>
        </div>

        {/* Editorial grid: hairline-separated cells, no cards. */}
        <ul
          data-reveal
          className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-px overflow-hidden rounded-card border border-line bg-line p-0"
        >
          {problem.items.map((item) => {
            const Icon = problemIcons[item.icon];
            return (
              <li key={item.title} className="flex flex-col gap-3 bg-page px-6 py-6">
                <span className="flex text-meta">
                  <Icon />
                </span>
                <span className="text-[17px] font-semibold text-primary">{item.title}</span>
                <p className="m-0 text-[15px] leading-[1.6] text-muted">{item.body}</p>
              </li>
            );
          })}
        </ul>

        <p
          data-reveal
          className="m-0 max-w-[860px] border-t border-line pt-6 text-[clamp(20px,1.8vw,24px)] leading-[1.45] font-medium text-pretty text-primary"
        >
          {problem.statement}
        </p>

        <div data-reveal className="flex flex-col gap-4">
          <span className="font-mono text-[11.5px] tracking-[0.12em] text-meta">{problem.statsLabel}</span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4">
            {problem.stats.map((stat) => (
              <StatCard key={stat.value + stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
