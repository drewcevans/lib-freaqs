import './PickleCatGreeting.css';

/* ── Pickle neon sign ─────────────────────────────────────── */
function PickleSign() {
  const bolts = [[14,14],[126,14],[14,282],[126,282]];
  return (
    <svg className="pcg-pickle-svg" viewBox="0 0 140 296"
         width="128" height="270" aria-hidden="true">
      <defs>
        {/* Layered glow: wide halo → medium bloom → sharp tube */}
        <filter id="ps-glow" x="-70%" y="-40%" width="240%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="wide"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="med"/>
          <feMerge>
            <feMergeNode in="wide"/>
            <feMergeNode in="med"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="ps-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Backing panel */}
      <rect x="2" y="2" width="136" height="292" rx="10"
            fill="#050510" stroke="#141424" strokeWidth="1.5"/>
      {/* Corner mounting bolts */}
      {bolts.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4.5" fill="#0c0c1c" stroke="#222232" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="1.5" fill="#303040"/>
        </g>
      ))}

      {/* ── Neon elements — animated as a group ── */}
      <g className="ps-neon">
        {/* Frame border */}
        <rect x="10" y="10" width="120" height="232" rx="7"
              fill="none" stroke="#00cc44" strokeWidth="2" opacity="0.5"
              filter="url(#ps-glow)"/>

        {/* Pickle body — bumpy oval with 5 bulges per side */}
        <path
          d="M 70 34
             C 76 32 84 38 88 50
             Q 93 60 89 70
             Q 95 83 89 95
             Q 95 109 89 122
             Q 95 137 89 150
             Q 94 163 88 175
             Q 91 186 84 196
             C 79 208 74 218 70 222
             C 66 218 61 208 56 196
             Q 49 186 52 175
             Q 46 163 51 150
             Q 45 137 51 122
             Q 45 109 51 95
             Q 45 83 51 70
             Q 47 60 52 50
             C 56 38 64 32 70 34 Z"
          fill="none" stroke="#00ff55" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round"
          filter="url(#ps-glow)"
        />

        {/* Stem / blossom nub */}
        <path
          d="M 63 37 Q 58 20 70 16 Q 82 20 77 37"
          fill="none" stroke="#00ff55" strokeWidth="3"
          strokeLinecap="round"
          filter="url(#ps-glow)"
        />

        {/* Divider line above text */}
        <line x1="16" y1="242" x2="124" y2="242"
              stroke="#009933" strokeWidth="1.5" opacity="0.55"
              filter="url(#ps-glow-sm)"/>

        {/* PICKLE label */}
        <text x="70" y="268"
              textAnchor="middle"
              fontFamily="'Courier New', Courier, monospace"
              fontSize="17" fontWeight="bold" letterSpacing="3.5"
              fill="none" stroke="#00ff55" strokeWidth="1"
              filter="url(#ps-glow)">
          PICKLE
        </text>
      </g>
    </svg>
  );
}

/* ── Cat neon sign ────────────────────────────────────────── */
function CatSign() {
  const bolts = [[14,14],[146,14],[14,266],[146,266]];
  return (
    <svg className="pcg-cat-svg" viewBox="0 0 160 280"
         width="144" height="260" aria-hidden="true">
      <defs>
        <filter id="cs-glow" x="-70%" y="-40%" width="240%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="wide"/>
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="med"/>
          <feMerge>
            <feMergeNode in="wide"/>
            <feMergeNode in="med"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="cs-glow-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="cs-eye" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Backing panel */}
      <rect x="2" y="2" width="156" height="276" rx="10"
            fill="#08040e" stroke="#18101e" strokeWidth="1.5"/>
      {/* Corner mounting bolts */}
      {bolts.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4.5" fill="#0e081a" stroke="#20102a" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="1.5" fill="#301840"/>
        </g>
      ))}

      {/* ── Neon elements — animated as a group ── */}
      <g className="cs-neon">
        {/* Frame border */}
        <rect x="10" y="10" width="140" height="218" rx="7"
              fill="none" stroke="#cc2299" strokeWidth="2" opacity="0.5"
              filter="url(#cs-glow)"/>

        {/* Head */}
        <circle cx="80" cy="90" r="44"
                fill="none" stroke="#ff44cc" strokeWidth="4"
                filter="url(#cs-glow)"/>

        {/* Left ear */}
        <path d="M 43 69 L 48 26 L 73 60"
              fill="none" stroke="#ff44cc" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round"
              filter="url(#cs-glow)"/>

        {/* Right ear */}
        <path d="M 117 69 L 112 26 L 87 60"
              fill="none" stroke="#ff44cc" strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round"
              filter="url(#cs-glow)"/>

        {/* Body */}
        <ellipse cx="82" cy="193" rx="53" ry="57"
                 fill="none" stroke="#ff44cc" strokeWidth="4"
                 filter="url(#cs-glow)"/>

        {/* Tail — C-curve to the right */}
        <path d="M 134 192 C 164 184 172 150 152 122 C 143 110 138 126 140 140"
              fill="none" stroke="#ff44cc" strokeWidth="4"
              strokeLinecap="round"
              filter="url(#cs-glow)"/>

        {/* Eyes */}
        <circle cx="66" cy="85" r="6" fill="#ff66dd" filter="url(#cs-eye)"/>
        <circle cx="94" cy="85" r="6" fill="#ff66dd" filter="url(#cs-eye)"/>

        {/* Divider */}
        <line x1="16" y1="242" x2="144" y2="242"
              stroke="#aa1188" strokeWidth="1.5" opacity="0.55"
              filter="url(#cs-glow-sm)"/>

        {/* CAT label */}
        <text x="80" y="264"
              textAnchor="middle"
              fontFamily="'Courier New', Courier, monospace"
              fontSize="22" fontWeight="bold" letterSpacing="7"
              fill="none" stroke="#ff44cc" strokeWidth="1"
              filter="url(#cs-glow)">
          CAT
        </text>
      </g>
    </svg>
  );
}

/* ── Scene ────────────────────────────────────────────────── */
export default function PickleCatGreeting() {
  return (
    <div className="pcg-scene" aria-hidden="true">
      <div className="pcg-pickle-wrapper">
        <PickleSign />
        <div className="pcg-pole pcg-pole--green" />
      </div>

      <div className="pcg-hearts">
        <span className="pcg-heart pcg-h1">💜</span>
        <span className="pcg-heart pcg-h2">💚</span>
        <span className="pcg-heart pcg-h3">💖</span>
        <span className="pcg-heart pcg-h4">✨</span>
      </div>

      <div className="pcg-cat-wrapper">
        <CatSign />
        <div className="pcg-pole pcg-pole--pink" />
      </div>
    </div>
  );
}
