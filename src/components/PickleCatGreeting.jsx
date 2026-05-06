// Warm internal glow positions (3 columns × 6 rows)
const PICKLE_GLOW = [
  { cx: 40, cy: 78 },  { cx: 55, cy: 70 },  { cx: 70, cy: 78 },
  { cx: 37, cy: 108 }, { cx: 55, cy: 100 }, { cx: 73, cy: 108 },
  { cx: 35, cy: 140 }, { cx: 55, cy: 132 }, { cx: 75, cy: 140 },
  { cx: 36, cy: 172 }, { cx: 55, cy: 165 }, { cx: 74, cy: 172 },
  { cx: 38, cy: 202 }, { cx: 55, cy: 196 }, { cx: 72, cy: 202 },
  { cx: 42, cy: 228 }, { cx: 55, cy: 223 }, { cx: 68, cy: 228 },
];

// Multicolor string light bulbs — scattered messily across body, arms, legs
const CAT_LIGHTS = [
  { cx: 48,  cy: 140, color: '#ff2200' },
  { cx: 92,  cy: 131, color: '#0088ff' },
  { cx: 130, cy: 142, color: '#ff8800' },
  { cx: 28,  cy: 170, color: '#ff2200' },
  { cx: 86,  cy: 178, color: '#0088ff' },
  { cx: 128, cy: 163, color: '#ff8800' },
  { cx: 10,  cy: 186, color: '#ff2200' },
  { cx: 148, cy: 184, color: '#0088ff' },
  { cx: 58,  cy: 213, color: '#ff8800' },
  { cx: 102, cy: 216, color: '#ff2200' },
];

export default function PickleCatGreeting() {
  return (
    <div className="pcg-scene" aria-hidden="true">

      {/* ── PICKLE ── */}
      <div className="pcg-pickle-wrapper">
        <svg className="pcg-pickle-svg" viewBox="0 0 110 255" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="pg-body" cx="35%" cy="30%" r="70%">
              <stop offset="0%"   stopColor="#7dff99"/>
              <stop offset="45%"  stopColor="#22aa44"/>
              <stop offset="100%" stopColor="#005520"/>
            </radialGradient>
            <radialGradient id="pg-warm" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#ffe566" stopOpacity="1"/>
              <stop offset="60%"  stopColor="#ffaa00" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#ff6600" stopOpacity="0"/>
            </radialGradient>
            <filter id="pg-glow" x="-30%" y="-8%" width="160%" height="116%">
              <feGaussianBlur stdDeviation="7" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="pg-crown-glow" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <clipPath id="pg-body-clip">
              <ellipse cx="55" cy="143" rx="44" ry="108"/>
            </clipPath>
          </defs>

          {/* Crown apex glow */}
          <circle cx="55" cy="16" r="14" fill="#66ff00" filter="url(#pg-crown-glow)" opacity=".7"/>
          <circle cx="55" cy="16" r="6"  fill="#ddff88"/>
          <circle cx="55" cy="16" r="3"  fill="white"/>

          {/* Stem curls */}
          <path d="M 55 30 Q 46 20 50 13" stroke="#007722" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          <path d="M 55 30 Q 64 20 60 13" stroke="#008833" strokeWidth="3"   strokeLinecap="round" fill="none"/>
          <ellipse cx="55" cy="32" rx="11" ry="7" fill="#004d1a"/>

          {/* Main body */}
          <ellipse cx="55" cy="143" rx="44" ry="108"
                   fill="url(#pg-body)" filter="url(#pg-glow)"/>

          {/* Internal warm glow — clipped to body shape */}
          <g clipPath="url(#pg-body-clip)">
            {PICKLE_GLOW.map(({ cx, cy }, i) => (
              <circle key={`h${i}`} cx={cx} cy={cy} r="18" fill="url(#pg-warm)"/>
            ))}
            {PICKLE_GLOW.map(({ cx, cy }, i) => (
              <circle key={`c${i}`} cx={cx} cy={cy} r="5" fill="#fff9cc" opacity=".9"/>
            ))}
          </g>

          {/* Vertical ridge lines (5 ribs) */}
          {[-20, -10, 0, 10, 20].map((dx, i) => (
            <ellipse key={i}
                     cx={55 + dx} cy="143"
                     rx={i === 2 ? 3 : 3.5}
                     ry="104"
                     fill="#003d14"
                     opacity={i === 2 ? '.18' : '.28'}/>
          ))}

          {/* Outer body edge */}
          <ellipse cx="55" cy="143" rx="44" ry="108"
                   fill="none" stroke="#00ff66" strokeWidth="1.5" opacity=".35"/>

          {/* Warts */}
          <circle cx="37" cy="70"  r="5.5" fill="#004d1a" opacity=".85"/>
          <circle cx="71" cy="83"  r="4"   fill="#004d1a" opacity=".85"/>
          <circle cx="36" cy="110" r="6.5" fill="#004d1a" opacity=".85"/>
          <circle cx="74" cy="132" r="4.5" fill="#004d1a" opacity=".85"/>
          <circle cx="35" cy="164" r="5"   fill="#004d1a" opacity=".85"/>
          <circle cx="72" cy="182" r="5.5" fill="#004d1a" opacity=".85"/>
          <circle cx="42" cy="208" r="4"   fill="#004d1a" opacity=".85"/>

          {/* Eyes */}
          <circle cx="43" cy="57" r="8.5" fill="white"/>
          <circle cx="67" cy="57" r="8.5" fill="white"/>
          <circle cx="45" cy="59" r="4.5" fill="#0a001f"/>
          <circle cx="69" cy="59" r="4.5" fill="#0a001f"/>
          <circle cx="47" cy="56" r="1.8" fill="white"/>
          <circle cx="71" cy="56" r="1.8" fill="white"/>

          {/* Smile */}
          <path d="M 40 73 Q 55 85 70 73"
                stroke="#004d1a" strokeWidth="2.8" strokeLinecap="round" fill="none"/>

          {/* Cheek blush */}
          <ellipse cx="34" cy="65" rx="7" ry="4" fill="#00ff66" opacity=".15"/>
          <ellipse cx="76" cy="65" rx="7" ry="4" fill="#00ff66" opacity=".15"/>

          {/* Left arm — back, static */}
          <g transform="translate(11,143) rotate(-8)">
            <rect x="-28" y="-7"  width="28" height="14" rx="7" fill="#007722"/>
            <circle cx="-28" cy="0" r="9" fill="#00aa33"/>
          </g>

          {/* Right arm — hug, animated */}
          <g className="pcg-pickle-arm-hug" transform="translate(99,143)">
            <rect x="0"  y="-7"  width="28" height="14" rx="7" fill="#007722"/>
            <circle cx="28" cy="0" r="9" fill="#00aa33"/>
          </g>
        </svg>
      </div>

      {/* ── HEARTS ── */}
      <div className="pcg-hearts">
        <span className="pcg-heart pcg-h1">💜</span>
        <span className="pcg-heart pcg-h2">💚</span>
        <span className="pcg-heart pcg-h3">💖</span>
        <span className="pcg-heart pcg-h4">✨</span>
      </div>

      {/* ── PINK CAT ── */}
      <div className="pcg-cat-wrapper">
        <svg className="pcg-cat-svg" viewBox="0 0 160 230" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cg-body" cx="32%" cy="28%" r="68%">
              <stop offset="0%"   stopColor="#ffd8f0"/>
              <stop offset="55%"  stopColor="#e055bb"/>
              <stop offset="100%" stopColor="#bb2288"/>
            </radialGradient>
            <radialGradient id="cg-head" cx="32%" cy="28%" r="68%">
              <stop offset="0%"   stopColor="#ffe0f5"/>
              <stop offset="55%"  stopColor="#ee77cc"/>
              <stop offset="100%" stopColor="#cc3399"/>
            </radialGradient>
            <filter id="cg-glow" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="light-glow" x="-80%" y="-80%" width="360%" height="360%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Body */}
          <ellipse cx="80" cy="162" rx="68" ry="62"
                   fill="url(#cg-body)" filter="url(#cg-glow)"/>

          {/* Quilted plush texture lines on body */}
          <path d="M 28 148 Q 80 140 132 148" stroke="#cc2299" strokeWidth="1.2" fill="none" opacity=".22"/>
          <path d="M 20 167 Q 80 159 140 167" stroke="#cc2299" strokeWidth="1.2" fill="none" opacity=".22"/>
          <path d="M 24 186 Q 80 178 136 186" stroke="#cc2299" strokeWidth="1.2" fill="none" opacity=".2"/>
          <path d="M 35 203 Q 80 197 125 203" stroke="#cc2299" strokeWidth="1"   fill="none" opacity=".18"/>
          {/* Vertical quilt seams */}
          <path d="M 80 100 Q 80 162 80 224"  stroke="#cc2299" strokeWidth="1"   fill="none" opacity=".14"/>
          <path d="M 50 108 Q 52 162 50 218"  stroke="#cc2299" strokeWidth="1"   fill="none" opacity=".12"/>
          <path d="M 110 108 Q 108 162 110 218" stroke="#cc2299" strokeWidth="1" fill="none" opacity=".12"/>

          {/* Legs */}
          <rect x="50" y="213" width="26" height="17" rx="11" fill="#cc3399"/>
          <rect x="84" y="213" width="26" height="17" rx="11" fill="#cc3399"/>
          {/* Toe bumps */}
          <ellipse cx="57"  cy="229" rx="5" ry="3" fill="#dd44aa" opacity=".6"/>
          <ellipse cx="69"  cy="229" rx="5" ry="3" fill="#dd44aa" opacity=".6"/>
          <ellipse cx="91"  cy="229" rx="5" ry="3" fill="#dd44aa" opacity=".6"/>
          <ellipse cx="103" cy="229" rx="5" ry="3" fill="#dd44aa" opacity=".6"/>

          {/* Head */}
          <circle cx="80" cy="73" r="52"
                  fill="url(#cg-head)" filter="url(#cg-glow)"/>

          {/* Head texture */}
          <path d="M 40 60 Q 80 52 120 60"  stroke="#cc2299" strokeWidth="1" fill="none" opacity=".15"/>
          <path d="M 32 78 Q 80 70 128 78"  stroke="#cc2299" strokeWidth="1" fill="none" opacity=".15"/>
          <path d="M 36 96 Q 80 90 124 96"  stroke="#cc2299" strokeWidth="1" fill="none" opacity=".12"/>

          {/* Ears — pointed triangle, outer + inner */}
          <polygon points="32,44 18,5  58,34"  fill="#aa1177"/>
          <polygon points="36,41 26,14 53,33"  fill="#ff99cc"/>
          <polygon points="102,34 138,5 128,44" fill="#aa1177"/>
          <polygon points="107,33 130,14 124,41" fill="#ff99cc"/>

          {/* Eyes — big kawaii button eyes */}
          <ellipse cx="62" cy="70" rx="14" ry="15" fill="white"/>
          <ellipse cx="98" cy="70" rx="14" ry="15" fill="white"/>
          <ellipse cx="63" cy="72" rx="8.5" ry="9.5" fill="#140028"/>
          <ellipse cx="99" cy="72" rx="8.5" ry="9.5" fill="#140028"/>
          {/* Sparkle highlights */}
          <circle cx="68"  cy="66" r="3.2" fill="white"/>
          <circle cx="104" cy="66" r="3.2" fill="white"/>
          <circle cx="62"  cy="77" r="1.5" fill="white" opacity=".65"/>
          <circle cx="98"  cy="77" r="1.5" fill="white" opacity=".65"/>

          {/* Nose */}
          <path d="M 76 84 L 80 89 L 84 84 Z" fill="#ff44aa"/>
          {/* Mouth */}
          <path d="M 74 91 Q 80 98 86 91"
                stroke="#bb2288" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

          {/* Cheek blush */}
          <ellipse cx="44" cy="82" rx="10" ry="6" fill="#ff55bb" opacity=".22"/>
          <ellipse cx="116" cy="82" rx="10" ry="6" fill="#ff55bb" opacity=".22"/>

          {/* Whiskers */}
          <line x1="12"  y1="78" x2="56"  y2="80" stroke="#ffaadd" strokeWidth="1.5" opacity=".55"/>
          <line x1="12"  y1="85" x2="56"  y2="84" stroke="#ffaadd" strokeWidth="1.5" opacity=".55"/>
          <line x1="12"  y1="92" x2="56"  y2="89" stroke="#ffaadd" strokeWidth="1.5" opacity=".55"/>
          <line x1="104" y1="80" x2="148" y2="78" stroke="#ffaadd" strokeWidth="1.5" opacity=".55"/>
          <line x1="104" y1="84" x2="148" y2="85" stroke="#ffaadd" strokeWidth="1.5" opacity=".55"/>
          <line x1="104" y1="89" x2="148" y2="92" stroke="#ffaadd" strokeWidth="1.5" opacity=".55"/>

          {/* ── MESSY LIGHT STRINGS ── */}
          {/* Upper chest wire */}
          <path d="M 30 147 C 52 139 78 150 108 141 C 126 135 142 145 150 141"
                stroke="#18182e" strokeWidth="2" fill="none" opacity=".8"/>
          {/* Mid torso wire */}
          <path d="M 22 172 C 48 164 78 176 112 167 C 132 161 148 170 156 166"
                stroke="#18182e" strokeWidth="2" fill="none" opacity=".8"/>
          {/* Diagonal cross wire — the messy bit */}
          <path d="M 35 155 C 60 168 96 160 132 172 C 142 176 150 168 154 163"
                stroke="#18182e" strokeWidth="1.5" fill="none" opacity=".65"/>
          {/* Left arm wire */}
          <path d="M 20 163 C 14 175 9  188 7  202"
                stroke="#18182e" strokeWidth="2" fill="none" opacity=".8"/>
          {/* Right arm wire */}
          <path d="M 140 163 C 146 175 151 188 153 202"
                stroke="#18182e" strokeWidth="2" fill="none" opacity=".8"/>
          {/* Leg wires */}
          <path d="M 63 213 C 60 220 58 226 57 229"
                stroke="#18182e" strokeWidth="2" fill="none" opacity=".8"/>
          <path d="M 97 213 C 100 220 102 226 103 229"
                stroke="#18182e" strokeWidth="2" fill="none" opacity=".8"/>

          {/* Light bulbs */}
          {CAT_LIGHTS.map(({ cx, cy, color }, i) => (
            <g key={i} className={`pcg-light pcg-light-${i}`} filter="url(#light-glow)">
              <rect x={cx - 2.5} y={cy - 5} width="5" height="5" rx="1" fill="#2a2a3e"/>
              <circle cx={cx} cy={cy + 5} r="9"   fill={color} opacity=".28"/>
              <circle cx={cx} cy={cy + 5} r="5.5" fill={color}/>
            </g>
          ))}

          {/* Left arm — hug, animated */}
          <g className="pcg-cat-arm-hug" transform="translate(12,158)">
            <rect x="-38" y="-9" width="38" height="18" rx="9" fill="#bb3399"/>
            <circle cx="-38" cy="0" r="12" fill="#dd55bb"/>
          </g>

          {/* Right arm — back, static */}
          <g transform="translate(148,158) rotate(8)">
            <rect x="0" y="-9" width="38" height="18" rx="9" fill="#bb3399"/>
            <circle cx="38" cy="0" r="12" fill="#dd55bb"/>
          </g>

        </svg>
      </div>

    </div>
  );
}
