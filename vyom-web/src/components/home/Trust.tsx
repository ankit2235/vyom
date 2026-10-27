import { trust } from '@/content/home';
import { trustIcons } from '@/components/icons';
import { Section, SectionHeading } from '@/components/ui';

export function Trust() {
  return (
    <Section id="trust">
      <div className="flex flex-col gap-14">
        <SectionHeading eyebrow={trust.eyebrow} heading={trust.heading} lead={trust.lead} />

        <div data-reveal className="flex flex-col gap-4">
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-px overflow-hidden rounded-card border border-line bg-line p-0">
            {trust.items.map((item) => {
              const Icon = trustIcons[item.icon];
              return (
                <li key={item.title} className="flex items-start gap-4 bg-alt px-6 py-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-button border border-strong bg-raised text-secondary">
                    <Icon />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-[16px] font-semibold text-primary">{item.title}</span>
                    <span className="text-[14.5px] leading-[1.55] text-muted">{item.body}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <span className="font-mono text-[11.5px] tracking-[0.12em] text-meta">{trust.footnote}</span>
        </div>
      </div>
    </Section>
  );
}
