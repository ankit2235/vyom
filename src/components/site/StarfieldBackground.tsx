/** Decorative orbit-and-starfield backdrop. Purely visual, never announced. */

type StarfieldProps = {
  readonly variant?: 'hero' | 'cta';
};

export function StarfieldBackground({ variant = 'hero' }: StarfieldProps) {
  const isHero = variant === 'hero';

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={isHero ? '0 0 1440 800' : '0 0 1440 600'}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {isHero ? <HeroOrbits /> : <CtaOrbits />}
      <g fill="var(--color-secondary)">{isHero ? <HeroStars /> : <CtaStars />}</g>
      {isHero ? (
        <FocusDot cx={1233.5} cy={159} />
      ) : (
        <FocusDot cx={1178.7} cy={191} />
      )}
    </svg>
  );
}

/** The accent marker: a filled dot inside a 35%-opacity ring. */
function FocusDot({ cx, cy }: { readonly cx: number; readonly cy: number }) {
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r="7"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <circle cx={cx} cy={cy} r="3" fill="var(--color-accent)" />
    </>
  );
}

function HeroOrbits() {
  return (
    <>
      <ellipse
        cx="1010"
        cy="420"
        rx="720"
        ry="300"
        transform="rotate(-14 1010 420)"
        fill="none"
        stroke="#1A2440"
        strokeWidth="1"
        strokeDasharray="2 7"
      />
      <ellipse
        cx="1010"
        cy="420"
        rx="560"
        ry="230"
        transform="rotate(-14 1010 420)"
        fill="none"
        stroke="#1A243F"
        strokeWidth="1"
      />
      <ellipse
        cx="1010"
        cy="420"
        rx="400"
        ry="160"
        transform="rotate(-14 1010 420)"
        fill="none"
        stroke="#151E35"
        strokeWidth="1"
      />
      <g fill="none" stroke="#22304F" strokeWidth="1">
        <path d="M1118 96 L1188 198 L1296 286 L1386 402" />
        <path d="M1188 198 L1352 118 L1236 52" />
      </g>
      <circle cx="1188" cy="198" r="5.5" fill="none" stroke="#2B3A5C" strokeWidth="1" />
    </>
  );
}

function CtaOrbits() {
  return (
    <>
      <ellipse
        cx="720"
        cy="300"
        rx="740"
        ry="260"
        fill="none"
        stroke="#1A2440"
        strokeWidth="1"
        strokeDasharray="2 7"
      />
      <ellipse cx="720" cy="300" rx="560" ry="190" fill="none" stroke="#18213A" strokeWidth="1" />
    </>
  );
}

function HeroStars() {
  return (
    <>
      <circle cx="92" cy="64" r="1.2" fillOpacity={0.5} />
      <circle cx="188" cy="142" r="0.8" fillOpacity={0.35} />
      <circle cx="310" cy="48" r="1" fillOpacity={0.4} />
      <circle cx="452" cy="96" r="0.7" fillOpacity={0.3} />
      <circle cx="604" cy="38" r="1.3" fillOpacity={0.5} />
      <circle cx="742" cy="120" r="0.9" fillOpacity={0.35} />
      <circle cx="868" cy="58" r="1.1" fillOpacity={0.45} />
      <circle cx="1004" cy="30" r="0.8" fillOpacity={0.3} />
      <circle cx="1118" cy="96" r="1.4" fillOpacity={0.55} />
      <circle cx="1236" cy="52" r="0.9" fillOpacity={0.4} />
      <circle cx="1352" cy="118" r="1.2" fillOpacity={0.5} />
      <circle cx="1404" cy="232" r="0.8" fillOpacity={0.3} />
      <circle cx="1296" cy="286" r="1.3" fillOpacity={0.5} />
      <circle cx="1386" cy="402" r="1" fillOpacity={0.4} />
      <circle cx="1312" cy="512" r="1.3" fillOpacity={0.45} />
      <circle cx="1408" cy="606" r="0.8" fillOpacity={0.3} />
      <circle cx="1268" cy="700" r="1.1" fillOpacity={0.4} />
      <circle cx="1150" cy="760" r="0.9" fillOpacity={0.35} />
      <circle cx="1012" cy="724" r="1.2" fillOpacity={0.4} />
      <circle cx="872" cy="770" r="0.8" fillOpacity={0.3} />
      <circle cx="734" cy="742" r="1" fillOpacity={0.35} />
      <circle cx="588" cy="782" r="0.8" fillOpacity={0.3} />
      <circle cx="420" cy="736" r="1.1" fillOpacity={0.35} />
      <circle cx="276" cy="770" r="0.8" fillOpacity={0.3} />
      <circle cx="128" cy="718" r="1" fillOpacity={0.35} />
      <circle cx="40" cy="612" r="0.9" fillOpacity={0.3} />
      <circle cx="70" cy="470" r="1.2" fillOpacity={0.35} />
      <circle cx="28" cy="330" r="0.8" fillOpacity={0.3} />
      <circle cx="54" cy="206" r="1" fillOpacity={0.35} />
      <circle cx="1188" cy="198" r="1.7" fillOpacity={0.65} />
      <circle cx="1222" cy="340" r="0.9" fillOpacity={0.35} />
      <circle cx="966" cy="172" r="0.7" fillOpacity={0.3} />
      <circle cx="842" cy="300" r="0.8" fillOpacity={0.25} />
      <circle cx="1404" cy="312" r="0.7" fillOpacity={0.3} />
      <circle cx="1176" cy="610" r="0.8" fillOpacity={0.3} />
    </>
  );
}

function CtaStars() {
  return (
    <>
      <circle cx="140" cy="90" r="1" fillOpacity={0.35} />
      <circle cx="310" cy="170" r="0.8" fillOpacity={0.3} />
      <circle cx="520" cy="70" r="1.2" fillOpacity={0.4} />
      <circle cx="930" cy="60" r="0.9" fillOpacity={0.35} />
      <circle cx="1120" cy="120" r="1.1" fillOpacity={0.4} />
      <circle cx="1320" cy="80" r="0.8" fillOpacity={0.3} />
      <circle cx="1380" cy="260" r="1" fillOpacity={0.35} />
      <circle cx="1240" cy="470" r="0.9" fillOpacity={0.3} />
      <circle cx="1000" cy="540" r="1.1" fillOpacity={0.35} />
      <circle cx="760" cy="560" r="0.8" fillOpacity={0.3} />
      <circle cx="430" cy="520" r="1" fillOpacity={0.35} />
      <circle cx="180" cy="470" r="0.9" fillOpacity={0.3} />
      <circle cx="60" cy="300" r="0.8" fillOpacity={0.3} />
    </>
  );
}
