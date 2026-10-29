import { whyAiNative } from '@/content/home';
import { Eyebrow, Section } from '@/components/ui';

export function WhyAiNative() {
  return (
    <Section id="why-ai-native" alt>
      <div className="flex flex-wrap items-start gap-x-16 gap-y-12">
        <div data-reveal className="flex min-w-0 flex-[1_1_360px] flex-col gap-4 lg:sticky lg:top-24">
          <Eyebrow>{whyAiNative.eyebrow}</Eyebrow>
          <h2 className="m-0 text-[clamp(32px,3.3vw,46px)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-primary">
            {whyAiNative.heading}
          </h2>
          <p className="m-0 text-[18px] leading-[1.6] text-pretty text-muted">{whyAiNative.lead}</p>
        </div>

        <ol
          data-reveal
          className="m-0 grid min-w-0 flex-[1.4_1_520px] list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-8 p-0"
        >
          {whyAiNative.points.map((point, index) => (
            <li key={point.title} className="flex gap-4 border-t border-line py-6">
              <span className="font-mono text-[12px] font-medium tracking-[0.1em] text-meta">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-2">
                <span className="text-[17px] font-semibold text-primary">{point.title}</span>
                <span className="text-[15px] leading-[1.6] text-muted">{point.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
