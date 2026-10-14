import { standards } from '@/content/home';
import { Container } from '@/components/ui';

export function Standards() {
  return (
    <section aria-label={standards.ariaLabel} className="border-b border-hairline bg-alt">
      <Container className="flex flex-wrap items-center gap-x-8 gap-y-3.5 py-[26px]">
        <span className="font-mono text-[11.5px] font-medium tracking-[0.14em] text-meta">
          {standards.label}
        </span>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-7 gap-y-2.5 p-0 font-mono text-[13px] tracking-[0.03em] text-secondary">
          {standards.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
