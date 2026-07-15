// Flat, unDraw-style illustrations recolored to the WattPe navy/green palette.
// Kept as simple geometric SVGs (no photographic detail) so they read consistently
// at any size and stay light to ship.

export function SolarPanelIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" fill="none" className={className} aria-hidden>
      <circle cx="192" cy="40" r="22" fill="#4ADE80" opacity="0.35" />
      <circle cx="192" cy="40" r="13" fill="#16A34A" />
      <path d="M40 170h160" stroke="#1A2332" strokeWidth="3" strokeLinecap="round" opacity="0.15" />
      <path d="M52 170V96l68-40 68 40v74" fill="#1A2332" opacity="0.06" />
      <g>
        <rect x="70" y="96" width="100" height="58" rx="4" fill="#16A34A" opacity="0.12" />
        {Array.from({ length: 4 }).map((_, col) => (
          <g key={col}>
            {Array.from({ length: 3 }).map((_, row) => (
              <rect
                key={row}
                x={74 + col * 24}
                y={100 + row * 18}
                width="20"
                height="14"
                rx="2"
                fill={(row + col) % 2 === 0 ? "#16A34A" : "#1A2332"}
              />
            ))}
          </g>
        ))}
      </g>
      <path d="M120 56 96 96h48z" fill="#1A2332" />
      <rect x="112" y="154" width="16" height="16" fill="#1A2332" opacity="0.5" />
    </svg>
  );
}

export function MeterIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <circle cx="100" cy="100" r="78" fill="#1A2332" opacity="0.06" />
      <circle cx="100" cy="100" r="60" fill="#1A2332" />
      <circle cx="100" cy="100" r="48" fill="#0e141f" />
      <path
        d="M60 118a40 40 0 0 1 80 0"
        stroke="#34D399"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 118a40 40 0 0 1 24-36"
        stroke="#16A34A"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="100" cy="120" r="6" fill="#4ADE80" />
      <path d="M100 120 122 96" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />
      <rect x="88" y="150" width="24" height="10" rx="3" fill="#16A34A" />
    </svg>
  );
}

export function SavingsIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 180" fill="none" className={className} aria-hidden>
      <path d="M20 160h180" stroke="#1A2332" strokeWidth="3" strokeLinecap="round" opacity="0.15" />
      <rect x="40" y="104" width="28" height="56" rx="4" fill="#1A2332" opacity="0.15" />
      <rect x="86" y="76" width="28" height="84" rx="4" fill="#1A2332" opacity="0.3" />
      <rect x="132" y="48" width="28" height="112" rx="4" fill="#16A34A" />
      <path
        d="M40 56 82 34l30 18 46-30"
        stroke="#34D399"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M140 18h18v18" stroke="#34D399" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="184" cy="100" r="16" fill="#4ADE80" opacity="0.3" />
      <circle cx="184" cy="100" r="9" fill="#16A34A" />
    </svg>
  );
}
