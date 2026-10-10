import { Eyebrow } from './Eyebrow';

/** Eyebrow + h2 + optional lead, the block every section opens with. */
export function SectionHeading({
  eyebrow,
  heading,
  lead,
}: {
  readonly eyebrow?: string;
  readonly heading: string;
  readonly lead?: string;
}) {
  return (
    <div data-reveal className="flex max-w-[760px] flex-col gap-4">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="m-0 text-[clamp(32px,3.3vw,46px)] leading-[1.08] font-semibold tracking-[-0.025em] text-balance text-primary">
        {heading}
      </h2>
      {lead ? (
        <p className="m-0 text-[18px] leading-[1.6] text-pretty text-muted">{lead}</p>
      ) : null}
    </div>
  );
}
