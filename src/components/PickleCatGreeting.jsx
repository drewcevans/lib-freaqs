// Light bulb positions on the ellipse around the cat's body
// Wire ellipse: cx=80 cy=162 rx=56 ry=54, sampled every 36°
const LIGHTS = [
  { cx: 80,  cy: 108, color: '#ff2200' },  // top
  { cx: 113, cy: 118, color: '#ff8800' },
  { cx: 133, cy: 145, color: '#f5ff00' },
  { cx: 133, cy: 179, color: '#00ff88' },
  { cx: 113, cy: 206, color: '#00f5ff' },
  { cx: 80,  cy: 216, color: '#4488ff' },  // bottom
  { cx: 47,  cy: 206, color: '#c800ff' },
  { cx: 27,  cy: 179, color: '#ff00c8' },
  { cx: 27,  cy: 145, color: '#ffffff' },
  { cx: 47,  cy: 118, color: '#ff2200' },
];

export default function PickleCatGreeting() {
  return (
    <div className="pcg-scene" aria-hidden="true">

      {/* ── PICKLE ── */}
      <div className="pcg-pickle-wrapper">
        <svg className="pcg-pickle-svg" viewBox="0 0 110 250" fill="none"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="pg-body" cx="30%" cy="25%" r="70%">
              <stop offset="0%"   stopColor="#66ff99"/>
              <stop offset="100%" stopColor="#007733"/>
            </radialGradient>
            <filter id="pg-glow" x="-25%" y="-10%" width="150%" height="120%">
              <feGaussianBlur stdDeviation="5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Stem nub */}
          <ellipse cx="50" cy="20" rx="11" ry="7" fill="#004d1f"/>
          <ellipse cx="62" cy="23" rx="6"  ry="5" fill="#005522" transform="rotate(-15 62 23)"/>

          {/* Body */}
          <ellipse cx="55" cy="135" rx="44" ry="110"
                   fill="url(#pg-body)" filter="url(#pg-glow)"/>

          {/* Wart bumps */}
          <circle cx="37" cy="68"  r="5.5" fill="#005c22" opacity=".85"/>
          <circle cx="69" cy="84"  r="4"   fill="#005c22" opacity=".85"/>
          <circle cx="38" cy="108" r="6.5" fill="#005c22" opacity=".85"/>
          <circle cx="72" cy="128" r="4.5" fill="#005c22" opacity=".85"/>
          <circle cx="35" cy="155" r="5"   fill="#005c22" opacity=".85"/>
          <circle cx="69" cy="174" r="5.5" fill="#005c22" opacity=".85"/>
          <circle cx="46" cy="196" r="4"   fill="#005c22" opacity=".85"/>
          <circle cx="66" cy="210" r="3.5" fill="#005c22" opacity=".85"/>
          <circle cx="38" cy="222" r="4"   fill="#005c22" opacity=".85"/>

          {/* Eyes */}
          <circle cx="41"  cy="94" r="9"   fill="white"/>
          <circle cx="69"  cy="94" r="9"   fill="white"/>
          <circle cx="43"  cy="96" r="4.5" fill="#0d001f"/>
          <circle cx="71"  cy="96" r="4.5" fill="#0d001f"/>
          <circle cx="45.5" cy="93" r="1.8" fill="white"/>
          <circle cx="73.5" cy="93" r="1.8" fill="white"/>

          {/* Smile */}
          <path d="M 37 112 Q 55 126 73 112"
                stroke="#004d1f" strokeWidth="3" strokeLinecap="round" fill="none"/>

          {/* Cheek blush */}
          <ellipse cx="32" cy="104" rx="7" ry="4" fill="#00ff66" opacity=".18"/>
          <ellipse cx="78" cy="104" rx="7" ry="4" fill="#00ff66" opacity=".18"/>

          {/* Left arm (back — stays still) */}
          <g transform="translate(11,138) rotate(-8)">
            <ellipse cx="-15" cy="0" rx="15" ry="7" fill="#009933"/>
            <ellipse cx="-30" cy="2"  rx="9"  ry="9" fill="#00bb44"/>
          </g>

          {/* Right arm — hug arm, animated */}
          <g className="pcg-pickle-arm-hug" transform="translate(99,138)">
            <ellipse cx="15" cy="-2" rx="15" ry="7" fill="#009933"/>
            <ellipse cx="30" cy="-4" rx="9"  ry="9" fill="#00bb44"/>
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
              <stop offset="0%"   stopColor="#ffccee"/>
              <stop offset="100%" stopColor="#dd44aa"/>
            </radialGradient>
            <radialGradient id="cg-head" cx="32%" cy="28%" r="68%">
              <stop offset="0%"   stopColor="#ffd6f0"/>
              <stop offset="100%" stopColor="#e055bb"/>
            </radialGradient>
            <filter id="cg-glow" x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="light-glow" x="-80%" y="-80%" width="360%" height="360%">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Body */}
          <ellipse cx="80" cy="162" rx="68" ry="63"
                   fill="url(#cg-body)" filter="url(#cg-glow)"/>

          {/* Head */}
          <circle cx="80" cy="73" r="52"
                  fill="url(#cg-head)" filter="url(#cg-glow)"/>

          {/* Left ear */}
          <polygon points="33,42 20,5 57,34"  fill="#cc3399"/>
          <polygon points="36,40 26,12 52,33" fill="#ff88cc"/>
          {/* Right ear */}
          <polygon points="103,34 140,5 127,42"  fill="#cc3399"/>
          <polygon points="108,33 134,12 124,40" fill="#ff88cc"/>

          {/* Eyes — big kawaii */}
          <ellipse cx="62" cy="70" rx="12" ry="13" fill="white"/>
          <ellipse cx="98" cy="70" rx="12" ry="13" fill="white"/>
          <ellipse cx="63" cy="72" rx="7.5" ry="8.5" fill="#1a0033"/>
          <ellipse cx="99" cy="72" rx="7.5" ry="8.5" fill="#1a0033"/>
          {/* Sparkle highlights */}
          <circle cx="67"  cy="67" r="2.5" fill="white"/>
          <circle cx="103" cy="67" r="2.5" fill="white"/>
          <circle cx="63"  cy="76" r="1.2" fill="white" opacity=".7"/>
          <circle cx="99"  cy="76" r="1.2" fill="white" opacity=".7"/>

          {/* Nose */}
          <path d="M 76 83 L 80 87 L 84 83 Z" fill="#ff44aa"/>

          {/* Mouth */}
          <path d="M 74 89 Q 80 96 86 89"
                stroke="#bb2288" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

          {/* Whiskers */}
          <line x1="18" y1="78" x2="60" y2="80" stroke="#ddaacc" strokeWidth="1.5" opacity=".65"/>
          <line x1="18" y1="84" x2="60" y2="84" stroke="#ddaacc" strokeWidth="1.5" opacity=".65"/>
          <line x1="18" y1="90" x2="60" y2="88" stroke="#ddaacc" strokeWidth="1.5" opacity=".65"/>
          <line x1="100" y1="80" x2="142" y2="78" stroke="#ddaacc" strokeWidth="1.5" opacity=".65"/>
          <line x1="100" y1="84" x2="142" y2="84" stroke="#ddaacc" strokeWidth="1.5" opacity=".65"/>
          <line x1="100" y1="88" x2="142" y2="90" stroke="#ddaacc" strokeWidth="1.5" opacity=".65"/>

          {/* Light string wire */}
          <ellipse cx="80" cy="162" rx="56" ry="54"
                   fill="none" stroke="#2a2a2a" strokeWidth="2" opacity=".7"/>

          {/* Light bulbs */}
          {LIGHTS.map(({ cx, cy, color }, i) => (
            <g key={i} className={`pcg-light pcg-light-${i}`} filter="url(#light-glow)">
              {/* Socket */}
              <rect x={cx - 2.5} y={cy - 5} width="5" height="5" rx="1" fill="#333"/>
              {/* Bulb glow halo */}
              <circle cx={cx} cy={cy + 5} r="9" fill={color} opacity=".25"/>
              {/* Bulb */}
              <circle cx={cx} cy={cy + 5} r="5.5" fill={color}/>
            </g>
          ))}

          {/* Left arm — hug arm, animated */}
          <g className="pcg-cat-arm-hug" transform="translate(12,158)">
            <ellipse cx="-18" cy="-3" rx="18" ry="8" fill="#cc44aa"/>
            <ellipse cx="-36" cy="-6" rx="11" ry="11" fill="#ee66cc"/>
          </g>

          {/* Right arm (back — stays still) */}
          <g transform="translate(148,158) rotate(10)">
            <ellipse cx="18" cy="-3" rx="18" ry="8" fill="#cc44aa"/>
            <ellipse cx="36" cy="-6" rx="11" ry="11" fill="#ee66cc"/>
          </g>

          {/* Stubby feet */}
          <ellipse cx="62"  cy="221" rx="20" ry="10" fill="#dd55bb"/>
          <ellipse cx="98"  cy="221" rx="20" ry="10" fill="#dd55bb"/>
        </svg>
      </div>

    </div>
  );
}
