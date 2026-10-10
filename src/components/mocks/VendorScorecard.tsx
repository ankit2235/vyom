import { vendorScorecard } from '@/content/home';
import { ProgressBar, SampleDataChip } from '@/components/ui';
import { cn } from '@/lib/cn';
import { AuditTrend } from './AuditTrend';

/**
 * Vendor A is fictional and labelled as such. Every figure is sample data.
 *
 * The product page adds the six-month trend; the home page does not.
 */
export function VendorScorecard({ trend = false }: { readonly trend?: boolean }) {
  return (
    <div className="overflow-hidden rounded-panel border border-strong bg-panel shadow-panel">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel-header px-[22px] py-[18px]">
        <div className="flex flex-col gap-1">
          <span className="text-[15px] font-semibold text-primary">{vendorScorecard.title}</span>
          <span className="font-mono text-[11.5px] tracking-[0.06em] text-meta">
            {vendorScorecard.subtitle}
          </span>
        </div>
        <SampleDataChip />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-px border-b border-line bg-line">
        {vendorScorecard.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1.5 bg-panel px-[22px] py-[18px]">
            <span className="font-mono text-[11px] tracking-[0.1em] text-meta">{stat.label}</span>
            <span
              className={cn(
                'text-[28px] leading-[1.1] font-semibold tracking-[-0.02em]',
                stat.tone === 'accent'
                  ? 'text-accent'
                  : stat.tone === 'amber'
                    ? 'text-amber'
                    : 'text-primary',
              )}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 p-[22px]">
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
          {vendorScorecard.findingsLabel}
        </span>
        {vendorScorecard.findings.map((finding) => (
          <div key={finding.label} className="flex flex-col gap-[7px]">
            <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-[14px] text-secondary">
              <span>{finding.label}</span>
              <span className="font-mono text-[12.5px] text-muted">{finding.value}</span>
            </div>
            <ProgressBar width={finding.width} tone="accent" height={8} />
          </div>
        ))}
      </div>

      {trend ? <AuditTrend /> : null}

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line bg-panel-header px-[22px] py-4">
        <span className="font-mono text-[11px] tracking-[0.1em] text-meta">
          {vendorScorecard.exportsLabel}
        </span>
        <span className="text-[13.5px] text-secondary">{vendorScorecard.exports}</span>
      </div>
    </div>
  );
}
