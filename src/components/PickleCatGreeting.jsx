// Warm internal bulb positions — 3 cols × 6 rows inside the pickle body
const PICKLE_LIGHTS = [
  { cx: 42, cy: 78 }, { cx: 65, cy: 70 }, { cx: 88, cy: 78 },
  { cx: 38, cy: 107 }, { cx: 65, cy: 99 }, { cx: 92, cy: 107 },
  { cx: 35, cy: 137 }, { cx: 65, cy: 129 }, { cx: 95, cy: 137 },
  { cx: 36, cy: 167 }, { cx: 65, cy: 159 }, { cx: 94, cy: 167 },
  { cx: 38, cy: 197 }, { cx: 65, cy: 191 }, { cx: 92, cy: 197 },
  { cx: 42, cy: 225 }, { cx: 65, cy: 219 }, { cx: 88, cy: 225 },
];

// Multicolor string lights — scattered messily across cat body, arms, legs
const CAT_LIGHTS = [
  { cx: 38,  cy: 145, color: '#ff2200' },
  { cx: 80,  cy: 135, color: '#0088ff' },
  { cx: 118, cy: 148, color: '#ff8800' },
  { cx: 150, cy: 140, color: '#ff44cc' },
  { cx: 24,  cy: 174, color: '#ff8800' },
  { cx: 85,  cy: 182, color: '#0088ff' },
  { cx: 122, cy: 167, color: '#ff2200' },
  { cx: 154, cy: 175, color: '#ff44cc' },
  { cx: 6,   cy: 196, color: '#ff2200' },
  { cx: 156, cy: 194, color: '#0088ff' },
  { cx: 56,  cy: 244, color: '#ff8800' },
  { cx: 50,  cy: 258, color: '#ff2200' },
  { cx: 105, cy: 248, color: '#0088ff' },
  { cx: 108, cy: 260, color: '#ff44cc' },
];

// Shared pickle body path — used for fill, clip, and outline
const PICKLE_PATH = `
  M 65 38
  C 73 37 84 50 92 65
  C 97 68 106 78 108 88
  C 110 96 108 104 110 114
  C 112 124 112 142 112 158
  C 112 166 114 174 112 184
  C 110 194 109 204 110 214
  C 111 224 110 234 106 247
  C 100 260 90 272 65 284
  C 40 272 30 260 24 247
  C 20 234 19 224 20 214
  C 21 204 20 194 18 184
  C 16 174 18 166 18 158
  C 18 142 18 124 20 114
  C 22 104 20 96 22 88
  C 24 78 33 68 38 65
  C 46 50 57 37 65 38 Z
`.trim();

export default function PickleCatGreeting() {
  return (
    <div className="pcg-scene" aria-hidden="true">

      {/* ══ PICKLE TOTEM ══ */}
      <div className="pcg-pickle-wrapper">
        <svg className="pcg-pickle-svg" viewBox="0 0 130 310" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="pg-bg" cx="50%" cy="55%" r="52%">
              <stop offset="0%"   stopColor="#001a08" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#000508" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="pg-body" cx="34%" cy="28%" r="72%">
              <stop offset="0%"   stopColor="#1a6622"/>
              <stop offset="55%"  stopColor="#0d4414"/>
              <stop offset="100%" stopColor="#061a08"/>
            </radialGradient>
            <radialGradient id="pg-warm" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff0a0" stopOpacity="1"/>
              <stop offset="45%"  stopColor="#ffb300" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#ff6600" stopOpacity="0"/>
            </radialGradient>
            {/* Outer glow: wide blur for the neon aura */}
            <filter id="pg-aura" x="-45%" y="-15%" width="190%" height="130%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10"/>
            </filter>
            {/* Neon stroke glow */}
            <filter id="pg-neon" x="-25%" y="-8%" width="150%" height="116%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Crown star burst */}
            <filter id="pg-crown" x="-250%" y="-250%" width="600%" height="600%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            {/* Warm inner lights — soft spread */}
            <filter id="pg-warm-blur" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="9"/>
            </filter>
            <clipPath id="pg-clip">
              <path d={PICKLE_PATH}/>
            </clipPath>
          </defs>

          {/* Night sky halo behind pickle */}
          <ellipse cx="65" cy="162" rx="72" ry="138" fill="url(#pg-bg)"/>

          {/* Wide neon aura (blurred duplicate behind body) */}
          <path d={PICKLE_PATH} fill="#00dd44" opacity="0.18" filter="url(#pg-aura)"/>

          {/* Main body fill */}
          <path d={PICKLE_PATH} fill="url(#pg-body)"/>

          {/* Warm internal light blobs — clipped to body */}
          <g clipPath="url(#pg-clip)">
            {PICKLE_LIGHTS.map(({ cx, cy }, i) => (
              <circle key={`wb${i}`} cx={cx} cy={cy} r="22"
                      fill="url(#pg-warm)" filter="url(#pg-warm-blur)"/>
            ))}
            {PICKLE_LIGHTS.map(({ cx, cy }, i) => (
              <circle key={`wd${i}`} cx={cx} cy={cy} r="5.5"
                      fill="#fff8cc" opacity="0.85"/>
            ))}
          </g>

          {/* Vertical ridge lines inside */}
          {[-18, -8, 0, 8, 18].map((dx, i) => (
            <line key={i}
                  x1={65 + dx} y1={i === 2 ? 44 : 52}
                  x2={65 + dx} y2={i === 2 ? 280 : 272}
                  stroke="#004810" strokeWidth={i === 2 ? 1.5 : 2}
                  opacity={i === 2 ? 0.45 : 0.6}
                  clipPath="url(#pg-clip)"/>
          ))}

          {/* Neon outline — glowing layer */}
          <path d={PICKLE_PATH} fill="none"
                stroke="#00ff55" strokeWidth="3.5" filter="url(#pg-neon)"/>

          {/* Neon outline — sharp bright edge on top */}
          <path d={PICKLE_PATH} fill="none"
                stroke="#88ffcc" strokeWidth="1.2" opacity="0.9"/>

          {/* Stem curls */}
          <path d="M 57 40 Q 51 26 54 17" stroke="#00cc44" strokeWidth="4"
                strokeLinecap="round" filter="url(#pg-neon)"/>
          <path d="M 73 40 Q 79 26 76 17" stroke="#00cc44" strokeWidth="3.5"
                strokeLinecap="round" filter="url(#pg-neon)"/>
          <ellipse cx="65" cy="41" rx="12" ry="6"
                   fill="#0a3810" stroke="#00ff55" strokeWidth="2" filter="url(#pg-neon)"/>

          {/* Crown beacon */}
          <circle cx="65" cy="9"  r="12" fill="#00ff55" opacity="0.35" filter="url(#pg-crown)"/>
          <circle cx="65" cy="9"  r="7"  fill="#00ff55" filter="url(#pg-crown)"/>
          <circle cx="65" cy="9"  r="3"  fill="white"/>
          {/* Starburst rays */}
          {[0,45,90,135,180,225,270,315].map((deg, i) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line key={i}
                    x1={65 + 10 * Math.cos(r)} y1={9 + 10 * Math.sin(r)}
                    x2={65 + 19 * Math.cos(r)} y2={9 + 19 * Math.sin(r)}
                    stroke="#00ff55" strokeWidth="1.8" opacity="0.75"
                    filter="url(#pg-neon)"/>
            );
          })}

          {/* Googly eyes */}
          <circle cx="49" cy="63" r="8.5" fill="white"/>
          <circle cx="81" cy="63" r="8.5" fill="white"/>
          <circle cx="51" cy="65" r="4.5" fill="#080818"/>
          <circle cx="83" cy="65" r="4.5" fill="#080818"/>
          <circle cx="53" cy="62" r="2"   fill="white"/>
          <circle cx="85" cy="62" r="2"   fill="white"/>

          {/* Smile */}
          <path d="M 47 78 Q 65 92 83 78"
                stroke="#004410" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        <div className="pcg-pole pcg-pole--green"/>
      </div>

      {/* ══ HEARTS ══ */}
      <div className="pcg-hearts">
        <span className="pcg-heart pcg-h1">💜</span>
        <span className="pcg-heart pcg-h2">💚</span>
        <span className="pcg-heart pcg-h3">💖</span>
        <span className="pcg-heart pcg-h4">✨</span>
      </div>

      {/* ══ CAT TOTEM ══ */}
      <div className="pcg-cat-wrapper">
        <svg className="pcg-cat-svg" viewBox="0 0 160 270" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cg-bg" cx="50%" cy="50%" r="52%">
              <stop offset="0%"   stopColor="#1a0018" stopOpacity="0.88"/>
              <stop offset="100%" stopColor="#040008" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="cg-body" cx="34%" cy="28%" r="68%">
              <stop offset="0%"   stopColor="#ffc8ee"/>
              <stop offset="55%"  stopColor="#e040aa"/>
              <stop offset="100%" stopColor="#a82078"/>
            </radialGradient>
            <radialGradient id="cg-head" cx="34%" cy="28%" r="68%">
              <stop offset="0%"   stopColor="#ffd4f2"/>
              <stop offset="55%"  stopColor="#ea55bb"/>
              <stop offset="100%" stopColor="#c02e95"/>
            </radialGradient>
            <filter id="cg-aura" x="-35%" y="-20%" width="170%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12"/>
            </filter>
            <filter id="cg-neon" x="-25%" y="-12%" width="150%" height="124%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="cg-body-soft" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="light-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Night halo */}
          <ellipse cx="80" cy="148" rx="88" ry="122" fill="url(#cg-bg)"/>

          {/* Pink neon aura */}
          <ellipse cx="80" cy="168" rx="65" ry="62"
                   fill="#ff44cc" opacity="0.15" filter="url(#cg-aura)"/>

          {/* Body */}
          <ellipse cx="80" cy="168" rx="65" ry="62"
                   fill="url(#cg-body)" stroke="#ff55cc" strokeWidth="2.5"
                   filter="url(#cg-body-soft)"/>
          {/* Body neon outline */}
          <ellipse cx="80" cy="168" rx="65" ry="62"
                   fill="none" stroke="#ff88ee" strokeWidth="1" opacity="0.7"/>

          {/* Quilted plush texture */}
          <path d="M 24 157 Q 80 148 136 157" stroke="#bb1188" strokeWidth="1" fill="none" opacity="0.2"/>
          <path d="M 17 175 Q 80 166 143 175" stroke="#bb1188" strokeWidth="1" fill="none" opacity="0.2"/>
          <path d="M 22 193 Q 80 184 138 193" stroke="#bb1188" strokeWidth="1" fill="none" opacity="0.18"/>
          <path d="M 80 106 L 80 230"         stroke="#bb1188" strokeWidth="1" fill="none" opacity="0.12"/>
          <path d="M 48 112 L 46 228"         stroke="#bb1188" strokeWidth="1" fill="none" opacity="0.10"/>
          <path d="M 112 112 L 114 228"       stroke="#bb1188" strokeWidth="1" fill="none" opacity="0.10"/>

          {/* Left arm — drooping, slightly slack */}
          <path d="M 17 162 C 8 176 4 193 6 212"
                stroke="#cc3399" strokeWidth="23" strokeLinecap="round"/>
          <path d="M 17 162 C 8 176 4 193 6 212"
                stroke="#e855bb" strokeWidth="16" strokeLinecap="round"/>

          {/* Right arm — drooping less symmetrically (bender) */}
          <path d="M 143 158 C 154 172 158 188 156 208"
                stroke="#cc3399" strokeWidth="23" strokeLinecap="round"/>
          <path d="M 143 158 C 154 172 158 188 156 208"
                stroke="#e855bb" strokeWidth="16" strokeLinecap="round"/>

          {/* Legs */}
          <rect x="51"  y="220" width="27" height="24" rx="13" fill="#c52e90"/>
          <rect x="82"  y="224" width="27" height="22" rx="12" fill="#bb2888"/>

          {/* ── HEAD (tilted 4° for bender slouch) ── */}
          <g transform="rotate(-4, 80, 88)">
            {/* Head neon aura */}
            <circle cx="80" cy="88" r="54" fill="#ff44cc" opacity="0.12" filter="url(#cg-aura)"/>
            {/* Head */}
            <circle cx="80" cy="88" r="54"
                    fill="url(#cg-head)" stroke="#ff55cc" strokeWidth="2.5"
                    filter="url(#cg-body-soft)"/>
            <circle cx="80" cy="88" r="54"
                    fill="none" stroke="#ff88ee" strokeWidth="1" opacity="0.65"/>

            {/* Left ear — normal */}
            <polygon points="35,52 20,8 62,42"  fill="#aa1177"/>
            <polygon points="38,49 27,14 58,40"  fill="#ff99cc"/>
            {/* Right ear — bent inward (bender-disheveled) */}
            <g transform="rotate(18, 120, 44)">
              <polygon points="98,44 128,8 132,52"  fill="#aa1177"/>
              <polygon points="102,42 126,14 128,48" fill="#ff99cc"/>
            </g>

            {/* Left eye — heavy-lidded (more open) */}
            <ellipse cx="62" cy="84" rx="13" ry="14" fill="white"/>
            <ellipse cx="63" cy="87" rx="8"   ry="8.5" fill="#160025"/>
            <circle  cx="67" cy="83" r="3"    fill="white"/>
            {/* Droopy upper lid */}
            <path d="M 49 79 Q 62 70 75 79" fill="#ea55bb" opacity="0.92"/>

            {/* Right eye — more squinted (bender exhaustion) */}
            <ellipse cx="98" cy="83" rx="12" ry="11" fill="white"/>
            <ellipse cx="99" cy="86" rx="7"   ry="6.5" fill="#160025"/>
            <circle  cx="103" cy="81" r="2.2" fill="white" opacity="0.75"/>
            {/* Heavy upper lid — more closed */}
            <path d="M 86 77 Q 98 68 110 77" fill="#ea55bb" opacity="0.96"/>
            {/* Extra squint crease */}
            <path d="M 87 84 Q 98 79 109 84"
                  stroke="#c02e90" strokeWidth="1.5" fill="none" opacity="0.5"/>

            {/* Nose */}
            <path d="M 76 98 L 80 104 L 84 98 Z" fill="#ff44aa"/>

            {/* Crooked goofy grin */}
            <path d="M 65 110 Q 79 121 91 113 Q 97 109 95 105"
                  stroke="#cc2288" strokeWidth="2.8" strokeLinecap="round" fill="none"/>

            {/* Rosy bender cheeks */}
            <ellipse cx="44"  cy="97" rx="12" ry="7" fill="#ff55aa" opacity="0.28"/>
            <ellipse cx="116" cy="95" rx="12" ry="7" fill="#ff55aa" opacity="0.28"/>

            {/* Whiskers — slightly askew */}
            <line x1="9"   y1="92" x2="55"  y2="94" stroke="#ffaadd" strokeWidth="1.5" opacity="0.5"/>
            <line x1="9"   y1="100" x2="55" y2="98" stroke="#ffaadd" strokeWidth="1.5" opacity="0.5"/>
            <line x1="105" y1="94" x2="151" y2="90" stroke="#ffaadd" strokeWidth="1.5" opacity="0.5"
                  transform="rotate(2, 128, 92)"/>
            <line x1="105" y1="100" x2="151" y2="105" stroke="#ffaadd" strokeWidth="1.5" opacity="0.5"/>

            {/* Lil spinning stars (dazed from the bender) */}
            <text x="128" y="26" fontSize="13" fill="#f5ff00" opacity="0.82">✦</text>
            <text x="24"  y="22" fontSize="11" fill="#00f5ff" opacity="0.72">✦</text>
            <text x="138" y="52" fontSize="9"  fill="#ff00c8" opacity="0.65">✦</text>
          </g>

          {/* ── MESSY LIGHT STRINGS ── */}
          <path d="M 28 152 C 52 142 80 155 108 145 C 128 137 148 150 158 145"
                stroke="#111122" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M 20 178 C 46 168 80 180 110 169 C 132 162 152 174 160 169"
                stroke="#111122" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M 36 160 C 58 172 96 163 136 175"
                stroke="#111122" strokeWidth="1.5" fill="none" opacity="0.65"/>
          <path d="M 17 162 C 10 177 6 193 7 208"
                stroke="#111122" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M 143 158 C 150 173 155 188 156 204"
                stroke="#111122" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M 64 222 C 60 232 57 244 56 254"
                stroke="#111122" strokeWidth="2" fill="none" opacity="0.8"/>
          <path d="M 96 225 C 100 235 103 245 104 254"
                stroke="#111122" strokeWidth="2" fill="none" opacity="0.8"/>

          {/* Light bulbs */}
          {CAT_LIGHTS.map(({ cx, cy, color }, i) => (
            <g key={i} filter="url(#light-glow)">
              <rect x={cx - 2.5} y={cy - 5} width="5" height="5" rx="1" fill="#1a1a30"/>
              <circle cx={cx} cy={cy + 5} r="8"   fill={color} opacity="0.28"/>
              <circle cx={cx} cy={cy + 5} r="5.5" fill={color}/>
            </g>
          ))}
        </svg>
        <div className="pcg-pole pcg-pole--pink"/>
      </div>

    </div>
  );
}
