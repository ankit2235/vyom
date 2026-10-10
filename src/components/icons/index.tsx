/** Inline SVG icons, traced from the design. No icon package. */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { readonly size?: number };

function Icon({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} strokeWidth={2} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </Icon>
  );
}

export function ChevronDownIcon({ size = 14, ...props }: IconProps) {
  return (
    <Icon size={size} strokeWidth={2} {...props}>
      <path d="M6 9.5l6 6 6-6" />
    </Icon>
  );
}

export function CheckIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} strokeWidth={2} {...props}>
      <path d="M6 12.5l4 4 8-9" />
    </Icon>
  );
}

/** The tick inside a completed case-run step. Heavier stroke, smaller box. */
export function StepCheckIcon({ size = 12, ...props }: IconProps) {
  return (
    <Icon size={size} strokeWidth={3} {...props}>
      <path d="M6 12.5l4 4 8-9" />
    </Icon>
  );
}

/** Half-filled amber circle: a step waiting on a person. */
export function HalfCircleIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth={2} />
      <path d="M12 5a7 7 0 0 1 0 14z" fill="currentColor" />
    </svg>
  );
}

/** Dashed ring: a step not yet reached. */
export function DashedCircleIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="3 3"
      />
    </svg>
  );
}

export function PlusIcon({ size = 16, ...props }: IconProps) {
  return (
    <Icon size={size} strokeWidth={2} {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function CloseIcon({ size = 22, ...props }: IconProps) {
  return (
    <Icon size={size} strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function MenuIcon({ size = 22, ...props }: IconProps) {
  return (
    <Icon size={size} strokeWidth={2} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

/* --- Product icons ------------------------------------------------------- */

export function CasesIcon({ size = 22, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M4 13.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.5" />
      <path d="M4 13.5l2.4-7.2A2 2 0 0 1 8.3 5h7.4a2 2 0 0 1 1.9 1.3l2.4 7.2" />
      <path d="M4 13.5h4.2l1.3 2.5h5l1.3-2.5H20" />
    </Icon>
  );
}

export function LiteratureIcon({ size = 22, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M5 4.5h9.5a1.5 1.5 0 0 1 1.5 1.5v4" />
      <path d="M5 4.5v14a1.5 1.5 0 0 0 1.5 1.5H11" />
      <path d="M8 8.5h5M8 11.5h3" />
      <circle cx="16" cy="16" r="3.2" />
      <path d="M18.4 18.4l2.1 2.1" />
    </Icon>
  );
}

export function AuditIcon({ size = 22, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 3.5l7 2.8v5.4c0 4.3-2.9 7.6-7 8.8-4.1-1.2-7-4.5-7-8.8V6.3l7-2.8z" />
      <path d="M9 12.2l2.1 2.1 4-4.1" />
    </Icon>
  );
}

export function ReportsIcon({ size = 22, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M8.8 12.5h6.4M8.8 16h4.2" />
    </Icon>
  );
}

export function SignalIcon({ size = 22, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12l5.2-5.2" />
      <circle cx="15.4" cy="9.6" r="0.9" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function OsIcon({ size = 24, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 3.5l8.5 4.6L12 12.7 3.5 8.1 12 3.5z" />
      <path d="M3.5 12l8.5 4.6 8.5-4.6" />
      <path d="M3.5 15.9l8.5 4.6 8.5-4.6" />
    </Icon>
  );
}

/* --- Assurance icons ----------------------------------------------------- */

export function ChartIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M4 19.5h16" />
      <path d="M7 16.5v-5M12 16.5V7M17 16.5v-8" />
    </Icon>
  );
}

export function ListIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M9 6.5h11M9 12h11M9 17.5h11" />
      <circle cx="5" cy="6.5" r="1" />
      <circle cx="5" cy="12" r="1" />
      <circle cx="5" cy="17.5" r="1" />
    </Icon>
  );
}

export function LockIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
    </Icon>
  );
}

export function PinIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 21s-6.5-5.8-6.5-10.8a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21z" />
      <circle cx="12" cy="10.2" r="2.4" />
    </Icon>
  );
}

export const productIcons = {
  cases: CasesIcon,
  literature: LiteratureIcon,
  audit: AuditIcon,
  reports: ReportsIcon,
  signal: SignalIcon,
  os: OsIcon,
} as const;

export function ShieldIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 3.5l7 2.8v5.4c0 4.3-2.9 7.6-7 8.8-4.1-1.2-7-4.5-7-8.8V6.3l7-2.8z" />
    </Icon>
  );
}

export function BanIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M6 18L18 6" />
    </Icon>
  );
}

export function ClockIcon({ size = 20, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3 1.8" />
    </Icon>
  );
}

export const securityIcons = {
  pin: PinIcon,
  lock: LockIcon,
  shield: ShieldIcon,
  ban: BanIcon,
  clock: ClockIcon,
  list: ListIcon,
} as const;

export const assuranceIcons = {
  chart: ChartIcon,
  list: ListIcon,
  lock: LockIcon,
  pin: PinIcon,
} as const;
