import { siteConfig } from "~/site.config";
import { draftNotice } from "@/content/legal";
import { Container, Eyebrow } from "@/components/ui";

type LegalContent = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly updated: string;
  readonly sections: readonly {
    readonly title: string;
    readonly body: string;
  }[];
};

/** Shared layout for /privacy and /terms. Both carry the draft notice. */
export function LegalPage({ content }: { readonly content: LegalContent }) {
  return (
    <Container className="py-16 sm:py-24">
      <div className="flex max-w-[820px] flex-col gap-10">
        <div className="flex flex-col gap-5">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1 className="m-0 text-[clamp(36px,4.4vw,56px)] leading-[1.05] font-semibold tracking-[-0.03em] text-primary">
            {content.heading}
          </h1>
          <span className="font-mono text-[12px] tracking-[0.06em] text-meta">
            {content.updated}
          </span>
        </div>

        {/* Unmissable, because neither page has been through legal yet. */}
        <div
          role="note"
          className="flex flex-col gap-2 rounded-card border border-amber-line bg-amber-soft px-6 py-5"
        >
          <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-amber">
            {draftNotice.label}
          </span>
          <p className="m-0 text-[15px] leading-[1.6] text-secondary">
            {draftNotice.text}
          </p>
        </div>

        <div className="flex flex-col gap-9">
          {content.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-3">
              <h2 className="m-0 text-[21px] leading-[1.25] font-semibold tracking-[-0.01em] text-primary">
                {section.title}
              </h2>
              <p className="m-0 text-[16px] leading-[1.7] text-muted">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-7">
          <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
            CONTACT
          </span>
          <span className="font-mono text-[13px] tracking-[0.04em] text-secondary">
            {siteConfig.email} · {siteConfig.locationMono}
          </span>
        </div>
      </div>
    </Container>
  );
}
