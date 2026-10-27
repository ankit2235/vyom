import { getSource } from '@/content/intelligence/sources';
import { formatDate } from '@/lib/intelligence/records';

/** Outlet and date for each source, each opening the original in a new tab. */
export function SourceLinks({ ids }: { readonly ids: readonly string[] }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
      {ids.map((id) => {
        const source = getSource(id);
        return (
          <li key={id}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[28px] items-center gap-2 text-[13.5px] text-secondary underline decoration-strong underline-offset-4 hover:text-primary hover:decoration-secondary"
            >
              {source.outlet}
              {source.format ? (
                <span className="font-mono text-[11px] tracking-[0.08em] text-meta no-underline">
                  {source.format.toUpperCase()}
                </span>
              ) : null}
              <span className="font-mono text-[11.5px] tracking-[0.04em] text-meta no-underline">
                {formatDate(source.publishedOn)}
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
