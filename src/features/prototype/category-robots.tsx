/**
 * Original decorative robot characters for the Build / Apply / Lead homepage cards.
 * Inline SVG in the Poster People manner: ink contours, flat fills from the host palette.
 * Purely decorative (aria-hidden); the card heading and text carry the meaning.
 */

const ink = "#181818";
const blue = "#126b9e";
const pink = "#b3245a";
const yellow = "#ffe45b";
const stroke = {
  stroke: ink,
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function BuildRobot() {
  return (
    <g {...stroke}>
      <line x1="12" y1="140" x2="188" y2="140" />
      {/* Stacked blocks it is assembling */}
      <rect x="138" y="108" width="36" height="32" rx="4" fill={yellow} />
      <rect x="146" y="78" width="30" height="30" rx="4" fill={pink} />
      <rect x="152" y="54" width="20" height="24" rx="4" fill="white" />
      {/* Legs and feet */}
      <rect x="62" y="118" width="10" height="18" fill="white" />
      <rect x="88" y="118" width="10" height="18" fill="white" />
      <rect x="54" y="134" width="22" height="7" rx="3.5" fill={ink} />
      <rect x="84" y="134" width="22" height="7" rx="3.5" fill={ink} />
      {/* Arms: one resting, one holding a wrench towards the blocks */}
      <path d="M50 84 L38 104" fill="none" />
      <circle cx="37" cy="107" r="5" fill="white" />
      <path d="M110 84 L126 94" fill="none" />
      <path d="M124 100 L144 82" fill="none" strokeWidth="6" />
      <path d="M140 76 a7 7 0 1 0 9 9" fill="none" strokeWidth="4" />
      <circle cx="128" cy="96" r="5" fill="white" />
      {/* Body with a control panel */}
      <rect x="50" y="70" width="60" height="50" rx="10" fill={blue} />
      <rect x="63" y="82" width="34" height="20" rx="4" fill="white" />
      <circle cx="72" cy="92" r="3" fill={pink} stroke="none" />
      <circle cx="80" cy="92" r="3" fill={yellow} stroke="none" />
      <line x1="86" y1="92" x2="92" y2="92" />
      {/* Neck, head with a screen face, antenna */}
      <rect x="74" y="60" width="12" height="11" fill="white" />
      <line x1="80" y1="22" x2="80" y2="11" />
      <circle cx="80" cy="8" r="5" fill={pink} />
      <rect x="46" y="22" width="68" height="40" rx="14" fill="white" />
      <rect x="56" y="30" width="48" height="24" rx="8" fill={ink} />
      <circle cx="70" cy="41" r="3.5" fill="white" stroke="none" />
      <circle cx="90" cy="41" r="3.5" fill="white" stroke="none" />
      <path d="M73 47 Q80 52 87 47" fill="none" stroke="white" strokeWidth="2.5" />
    </g>
  );
}

function ApplyRobot() {
  return (
    <g {...stroke}>
      <line x1="12" y1="140" x2="188" y2="140" />
      {/* Desk and laptop with an AI spark on screen */}
      <line x1="110" y1="112" x2="110" y2="140" />
      <line x1="180" y1="112" x2="180" y2="140" />
      <rect x="96" y="104" width="94" height="9" rx="3" fill="white" />
      <rect x="126" y="64" width="46" height="34" rx="4" fill="white" />
      <path d="M118 104 L122 98 L176 98 L180 104 Z" fill={ink} />
      <path
        d="M149 72 L152 79 L159 81 L152 83 L149 90 L146 83 L139 81 L146 79 Z"
        fill={pink}
        strokeWidth="2"
      />
      {/* Chair */}
      <line x1="46" y1="120" x2="42" y2="140" />
      <line x1="92" y1="120" x2="96" y2="140" />
      <rect x="36" y="112" width="64" height="9" rx="4.5" fill={yellow} />
      {/* Legs reaching under the desk */}
      <path d="M62 114 L62 130 L76 130" fill="none" />
      <path d="M80 114 L80 130 L94 130" fill="none" />
      {/* Body */}
      <rect x="44" y="72" width="52" height="42" rx="12" fill={pink} />
      <circle cx="70" cy="90" r="6" fill="white" />
      {/* Arm typing on the laptop */}
      <path d="M94 86 Q110 92 120 98" fill="none" />
      <circle cx="121" cy="99" r="4.5" fill="white" />
      {/* Round head with a visor and side bolts */}
      <circle cx="42" cy="44" r="5" fill={blue} />
      <circle cx="98" cy="44" r="5" fill={blue} />
      <circle cx="70" cy="44" r="27" fill="white" />
      <rect x="50" y="35" width="40" height="18" rx="9" fill={blue} />
      <circle cx="62" cy="44" r="3.5" fill="white" stroke="none" />
      <circle cx="78" cy="44" r="3.5" fill="white" stroke="none" />
      <path d="M70 17 L70 8" fill="none" />
      <path d="M64 8 L76 8" fill="none" />
    </g>
  );
}

function LeadRobot() {
  return (
    <g {...stroke}>
      <line x1="12" y1="140" x2="188" y2="140" />
      {/* Podium */}
      <rect x="48" y="116" width="84" height="24" rx="4" fill="white" />
      <line x1="62" y1="128" x2="118" y2="128" />
      {/* Flag pole and flag */}
      <line x1="146" y1="16" x2="146" y2="116" />
      <path d="M146 18 L182 30 L146 42 Z" fill={blue} />
      {/* Arms: one holding the pole, one pointing ahead */}
      <path d="M114 84 L132 72 L142 72" fill="none" />
      <circle cx="145" cy="72" r="5" fill="white" />
      <path d="M66 84 L46 74" fill="none" />
      <circle cx="43" cy="72" r="5" fill="white" />
      <path d="M22 66 L32 66 M24 58 L33 62 M24 74 L33 70" fill="none" strokeWidth="2.5" />
      {/* Body with a light on the chest */}
      <rect x="66" y="70" width="48" height="46" rx="10" fill={yellow} />
      <circle cx="90" cy="92" r="8" fill={pink} />
      {/* Head with a happy screen face and a top light */}
      <rect x="84" y="18" width="12" height="9" rx="2" fill={blue} />
      <rect x="62" y="26" width="56" height="40" rx="9" fill="white" />
      <rect x="70" y="34" width="40" height="24" rx="6" fill={ink} />
      <path d="M77 48 Q81 42 85 48" fill="none" stroke="white" strokeWidth="2.5" />
      <path d="M95 48 Q99 42 103 48" fill="none" stroke="white" strokeWidth="2.5" />
      <rect x="84" y="66" width="12" height="5" fill="white" />
    </g>
  );
}

const robots = { build: BuildRobot, apply: ApplyRobot, lead: LeadRobot } as const;

export function CategoryRobot({ slug }: { slug: keyof typeof robots }) {
  const Robot = robots[slug];
  return (
    <svg
      className="category-robot"
      viewBox="0 0 200 150"
      aria-hidden="true"
      focusable="false"
      data-category-robot={slug}
    >
      <Robot />
    </svg>
  );
}
