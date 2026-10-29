import { basisHelp, basisLabel, cardCopy, graphCopy, linkStatusLabel, statusLabel } from '@/content/intelligence/dashboard';
import type { Basis, EdgeStatus, EvidenceStatus, LinkStatus } from '@/content/intelligence/types';
import { Chip } from '@/components/ui';
import type { ChipSize } from '@/components/ui/Chip';
import { cn } from '@/lib/cn';

/**
 * Evidence chips never use the accent or amber colours: those mean AI activity
 * and human decisions. Strength of evidence is shown by shape instead —
 * a filled dot for official or verified, a hollow dot for reported, and a
 * dashed border for anything unverified or not established.
 */
type Strength = 'firm' | 'reported' | 'open';

const statusStrength: Record<EvidenceStatus, Strength> = {
  'official-alert': 'firm',
  'distribution-verified': 'firm',
  'reported-by-media': 'reported',
  'historical-case': 'reported',
  'under-investigation': 'open',
  'potential-link-unverified': 'open',
  'causality-not-established': 'open',
};

const basisStrength: Record<Basis, Strength> = {
  official: 'firm',
  corroborated: 'firm',
  reported: 'reported',
  'not-established': 'open',
};

function Dot({ strength }: { readonly strength: Strength }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'mr-1.5 inline-block size-1.5 shrink-0 rounded-full',
        strength === 'firm' && 'bg-primary',
        strength === 'reported' && 'border border-secondary',
        strength === 'open' && 'border border-dashed border-muted',
      )}
    />
  );
}

function EvidenceChipBase({
  strength,
  label,
  title,
  size,
}: {
  readonly strength: Strength;
  readonly label: string;
  readonly title?: string;
  readonly size: ChipSize;
}) {
  return (
    <span title={title} className="inline-flex">
      <Chip tone={strength === 'open' ? 'dashed' : 'default'} size={size}>
        <Dot strength={strength} />
        {label.toUpperCase()}
      </Chip>
    </span>
  );
}

export function StatusChip({ status, size = 'sm' }: { readonly status: EvidenceStatus; readonly size?: ChipSize }) {
  return <EvidenceChipBase strength={statusStrength[status]} label={statusLabel[status]} size={size} />;
}

export function BasisChip({ basis, size = 'xs' }: { readonly basis: Basis; readonly size?: ChipSize }) {
  return (
    <EvidenceChipBase
      strength={basisStrength[basis]}
      label={basisLabel[basis]}
      title={basisHelp[basis]}
      size={size}
    />
  );
}

const linkStrength: Record<LinkStatus, Strength> = {
  documented: 'firm',
  reported: 'reported',
  'not-established': 'open',
};

/** Whether a supply-chain link is documented, only reported, or not established. */
export function LinkStatusChip({ status, size = 'xs' }: { readonly status: LinkStatus; readonly size?: ChipSize }) {
  return <EvidenceChipBase strength={linkStrength[status]} label={linkStatusLabel[status]} size={size} />;
}

const edgeStrength: Record<EdgeStatus, Strength> = {
  verified: 'firm',
  reported: 'reported',
  inferred: 'open',
  unverified: 'open',
};

/** How a supply-chain relationship is supported: verified, reported, inferred or unverified. */
export function EdgeStatusChip({ status, size = 'xs' }: { readonly status: EdgeStatus; readonly size?: ChipSize }) {
  return (
    <EvidenceChipBase
      strength={edgeStrength[status]}
      label={graphCopy.edge[status]}
      title={graphCopy.edgeHelp[status]}
      size={size}
    />
  );
}

/** Marks real-world, public-source content, as distinct from SAMPLE DATA. */
export function PublicSourceChip({ size = 'sm' }: { readonly size?: ChipSize }) {
  return (
    <Chip tone="default" size={size} className="text-primary">
      {cardCopy.publicSource}
    </Chip>
  );
}
