import { reportOutline } from '@/content/products';
import { Chip } from '@/components/ui';
import { MockPanel } from './MockPanel';

const tones = { accent: 'accent', amber: 'amber', default: 'default' } as const;

/** A periodic report, section by section, with where each one stands. */
export function ReportOutline() {
  return (
    <MockPanel title="Report outline" subtitle={reportOutline.title}>
      <ol className="m-0 flex list-none flex-col p-0">
        {reportOutline.sections.map((section, index) => (
          <li
            key={section.number}
            className={cnRow(index === reportOutline.sections.length - 1)}
          >
            <span className="w-6 shrink-0 font-mono text-[12.5px] text-meta">{section.number}</span>
            <span className="min-w-0 flex-1 text-[14px] text-secondary">{section.title}</span>
            <Chip tone={tones[section.tone]}>{section.status.toUpperCase()}</Chip>
          </li>
        ))}
      </ol>
    </MockPanel>
  );
}

function cnRow(isLast: boolean): string {
  return `flex flex-wrap items-center gap-x-3 gap-y-2 px-[22px] py-3 ${
    isLast ? '' : 'border-b border-hairline'
  }`;
}
