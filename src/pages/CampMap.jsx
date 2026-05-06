import { useState, useMemo } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState } from '../components/DataState';
import './CampMap.css';

// ── Sleeping spot grid: rows A–F, cols 1–5 ──────────────────────────────
// Map SVG viewBox: 0 0 720 520
const SLEEP_ROWS = 'ABCDEF'.split('');
const SLEEP_COLS = [1, 2, 3, 4, 5];
const SLEEP_ORIGIN = { x: 388, y: 68 };
const SLEEP_STEP   = { x: 54,  y: 52 };

const SLEEP_SPOTS = {};
SLEEP_ROWS.forEach((r, ri) => {
  SLEEP_COLS.forEach((c, ci) => {
    SLEEP_SPOTS[`${r}${c}`] = {
      x: SLEEP_ORIGIN.x + ci * SLEEP_STEP.x,
      y: SLEEP_ORIGIN.y + ri * SLEEP_STEP.y,
      label: `${r}${c}`,
    };
  });
});

// ── Parking spots: P1–P9 ─────────────────────────────────────────────────
const PARK_SPOTS = {};
[[1,55,72],[2,140,72],[3,225,72],[4,55,132],[5,140,132],[6,225,132],
 [7,55,192],[8,140,192],[9,225,192]].forEach(([n,x,y]) => {
  PARK_SPOTS[`P${n}`] = { x, y, label: `P${n}` };
});

const PERSON_COLORS = [
  '#c800ff','#ff00c8','#00f5ff','#00ff88',
  '#f5ff00','#ff6600','#ff88ff','#88ffcc','#ffaa00',
];

function parseSpot(val) {
  if (!val) return null;
  const m = (val + '').match(/([A-Fa-f])\s*([1-5])/);
  return m ? `${m[1].toUpperCase()}${m[2]}` : null;
}

function parseParkSpot(val) {
  if (!val) return null;
  const m = (val + '').match(/[Pp]\s*([1-9])/);
  return m ? `P${m[1]}` : null;
}

export default function CampMap({ year }) {
  const freaqs = useSheetData(year, SHEET_TABS.freaqs);
  const [selected, setSelected] = useState(null);

  const placements = useMemo(() => {
    if (!freaqs.data.length) return { sleep: {}, park: [], unplaced: [] };

    const sleep = {};        // spotId → person
    const park  = [];        // { person, spot }
    const unplaced = [];
    let nextSleep = 0;
    let nextPark  = 0;

    const allSleepIds = Object.keys(SLEEP_SPOTS);
    const allParkIds  = Object.keys(PARK_SPOTS);

    freaqs.data.forEach((person, pi) => {
      const color = PERSON_COLORS[pi % PERSON_COLORS.length];
      const p = { ...person, _color: color };

      // Sleeping spot
      const spotId = parseSpot(person['Sleeping Situation']);
      if (spotId && SLEEP_SPOTS[spotId] && !sleep[spotId]) {
        sleep[spotId] = p;
      } else {
        // Auto-place in next available sleep spot
        while (nextSleep < allSleepIds.length && sleep[allSleepIds[nextSleep]]) nextSleep++;
        if (nextSleep < allSleepIds.length) {
          sleep[allSleepIds[nextSleep]] = p;
          nextSleep++;
        } else {
          unplaced.push(p);
        }
      }

      // Car spot
      if ((person['Car Info'] || '').trim()) {
        const pSpotId = parseParkSpot(person['Car Info']);
        if (pSpotId && PARK_SPOTS[pSpotId]) {
          park.push({ person: p, spot: PARK_SPOTS[pSpotId] });
        } else {
          const autoId = allParkIds[nextPark % allParkIds.length];
          park.push({ person: p, spot: PARK_SPOTS[autoId] });
          nextPark++;
        }
      }
    });

    return { sleep, park, unplaced };
  }, [freaqs.data]);

  const initials = (name) => (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSelect = (person) => {
    setSelected(selected?.Name === person?.Name ? null : person);
  };

  if (freaqs.loading) return <LoadingState label="Loading camp map..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-cyan">Camp Map 🗺️</h1>
        <p className="page-subtitle">Party Palace {year} — click any icon to see who's where</p>
      </div>

      <div className="map-wrapper">
        <svg
          className="camp-map-svg"
          viewBox="0 0 720 520"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Camp map"
        >
          {/* ── Background ── */}
          <rect width="720" height="520" rx="18" fill="#06061a"/>

          {/* ── Outer border glow ── */}
          <rect x="1" y="1" width="718" height="518" rx="17"
                fill="none" stroke="rgba(200,0,255,0.3)" strokeWidth="2"/>

          {/* ── Grid lines ── */}
          {[...Array(14)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i*40} x2="720" y2={i*40}
                  stroke="rgba(200,0,255,0.04)" strokeWidth="1"/>
          ))}
          {[...Array(19)].map((_, i) => (
            <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="520"
                  stroke="rgba(200,0,255,0.04)" strokeWidth="1"/>
          ))}

          {/* ══ ZONES ══════════════════════════════════════════════════════ */}

          {/* Parking zone */}
          <rect x="12" y="42" width="292" height="182" rx="10"
                fill="rgba(0,245,255,0.04)" stroke="rgba(0,245,255,0.18)" strokeWidth="1.5"/>
          <text x="22" y="58" fontFamily="Orbitron,monospace" fontSize="9"
                fill="rgba(0,245,255,0.55)" letterSpacing="2">PARKING</text>

          {/* Common area */}
          <rect x="12" y="238" width="292" height="148" rx="10"
                fill="rgba(0,255,136,0.04)" stroke="rgba(0,255,136,0.18)" strokeWidth="1.5"/>
          <text x="22" y="254" fontFamily="Orbitron,monospace" fontSize="9"
                fill="rgba(0,255,136,0.55)" letterSpacing="2">COMMON AREA</text>

          {/* Stage */}
          <rect x="12" y="398" width="292" height="108" rx="10"
                fill="rgba(255,0,200,0.05)" stroke="rgba(255,0,200,0.2)" strokeWidth="1.5"/>
          <text x="22" y="414" fontFamily="Orbitron,monospace" fontSize="9"
                fill="rgba(255,0,200,0.6)" letterSpacing="2">STAGE / GATHERING</text>
          {/* Stage decoration */}
          <rect x="80" y="430" width="160" height="60" rx="8"
                fill="rgba(255,0,200,0.08)" stroke="rgba(255,0,200,0.3)" strokeWidth="1"/>
          <text x="160" y="466" textAnchor="middle" fontFamily="Orbitron,monospace"
                fontSize="11" fill="rgba(255,0,200,0.7)">🎪 PARTY PALACE</text>

          {/* Sleeping zone */}
          <rect x="368" y="42" width="340" height="464" rx="10"
                fill="rgba(200,0,255,0.04)" stroke="rgba(200,0,255,0.2)" strokeWidth="1.5"/>
          <text x="378" y="58" fontFamily="Orbitron,monospace" fontSize="9"
                fill="rgba(200,0,255,0.55)" letterSpacing="2">SLEEPING ZONE</text>

          {/* Entrance */}
          <rect x="12" y="8" width="696" height="28" rx="6"
                fill="rgba(245,255,0,0.05)" stroke="rgba(245,255,0,0.2)" strokeWidth="1"/>
          <text x="360" y="24" textAnchor="middle" fontFamily="Orbitron,monospace"
                fontSize="10" fill="rgba(245,255,0,0.65)" letterSpacing="3">
            ⚡ PARTY PALACE CAMP — LiB {year} ⚡
          </text>

          {/* ══ SLEEPING SPOTS ══════════════════════════════════════════════ */}
          {Object.values(SLEEP_SPOTS).map((spot) => {
            const person = placements.sleep[spot.label];
            return (
              <g key={spot.label} onClick={() => person && handleSelect(person)}
                 style={{ cursor: person ? 'pointer' : 'default' }}>
                {/* Spot circle */}
                <circle cx={spot.x} cy={spot.y} r={18}
                  fill={person ? `color-mix(in srgb, ${person._color} 18%, #06061a)` : 'rgba(255,255,255,0.03)'}
                  stroke={person ? person._color : 'rgba(200,0,255,0.15)'}
                  strokeWidth={person ? 2 : 1}/>
                {person && (
                  <circle cx={spot.x} cy={spot.y} r={18}
                    fill="none" stroke={person._color}
                    strokeWidth="1.5" opacity="0.4"
                    filter="url(#personGlow)"/>
                )}
                {/* Spot label / initials */}
                <text cx={spot.x} cy={spot.y} x={spot.x} y={spot.y + 4}
                  textAnchor="middle" fontFamily="Orbitron,monospace"
                  fontSize={person ? 9 : 8}
                  fill={person ? person._color : 'rgba(200,0,255,0.3)'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  {person ? initials(person['Name']) : spot.label}
                </text>
                {/* Person name below on hover — always show small */}
                {person && (
                  <text x={spot.x} y={spot.y + 30}
                    textAnchor="middle" fontFamily="Orbitron,monospace"
                    fontSize="7" fill={person._color} opacity="0.7"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    {(person['Name'] || '').split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}

          {/* ══ CAR SPOTS ═══════════════════════════════════════════════════ */}
          {Object.values(PARK_SPOTS).map((spot) => {
            const entry = placements.park.find(p => p.spot.label === spot.label);
            const person = entry?.person;
            return (
              <g key={spot.label} onClick={() => person && handleSelect(person)}
                 style={{ cursor: person ? 'pointer' : 'default' }}>
                <rect x={spot.x - 20} y={spot.y - 14} width="40" height="28" rx="5"
                  fill={person ? `color-mix(in srgb, ${person._color} 12%, #06061a)` : 'rgba(255,255,255,0.02)'}
                  stroke={person ? person._color : 'rgba(0,245,255,0.12)'}
                  strokeWidth={person ? 1.5 : 1}/>
                <text x={spot.x} y={spot.y + 5}
                  textAnchor="middle" fontFamily="Orbitron,monospace"
                  fontSize={person ? 10 : 9}
                  fill={person ? person._color : 'rgba(0,245,255,0.25)'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  {person ? '🚗' : spot.label}
                </text>
                {person && (
                  <text x={spot.x} y={spot.y + 26}
                    textAnchor="middle" fontFamily="Orbitron,monospace"
                    fontSize="7" fill={person._color} opacity="0.7"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}>
                    {(person['Name'] || '').split(' ')[0]}
                  </text>
                )}
              </g>
            );
          })}

          {/* Common area icons */}
          <text x="160" y="300" textAnchor="middle" fontSize="28" opacity=".35">🔥</text>
          <text x="100" y="360" textAnchor="middle" fontSize="22" opacity=".25">🎒</text>
          <text x="220" y="360" textAnchor="middle" fontSize="22" opacity=".25">🪑</text>

          {/* Glow filter */}
          <defs>
            <filter id="personGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
        </svg>

        {/* ── Info panel ── */}
        {selected && (
          <div className="map-info-panel" style={{ '--pcolor': selected._color }}>
            <div className="map-info-header">
              <span className="map-info-name">{selected['Name']}</span>
              <button className="map-info-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="map-info-rows">
              {selected['Arrival Day'] && (
                <div className="map-info-row"><span>💃</span><span>Arrives {selected['Arrival Day']} {selected['Arrival Time'] ? `@ ${selected['Arrival Time']}` : ''}</span></div>
              )}
              {selected['Departure Day'] && (
                <div className="map-info-row"><span>✌️</span><span>Leaves {selected['Departure Day']}</span></div>
              )}
              {selected['Sleeping Situation'] && (
                <div className="map-info-row"><span>🏕️</span><span>{selected['Sleeping Situation']}</span></div>
              )}
              {selected['Car Info'] && (
                <div className="map-info-row"><span>🚗</span><span>{selected['Car Info']}</span></div>
              )}
              {/^(yes|true|1|y)$/i.test(selected['Builder'] || '') && (
                <div className="map-info-row"><span>🎨</span><span className="neon-green">Build Crew</span></div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="map-legend">
        <div className="map-legend-item">
          <span className="map-legend-dot" style={{ background: 'var(--neon-purple)' }}/>
          <span>Sleeping spot</span>
        </div>
        <div className="map-legend-item">
          <span className="map-legend-rect" style={{ borderColor: 'var(--neon-cyan)' }}/>
          <span>Car spot</span>
        </div>
        <div className="map-legend-item" style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
          Spots are auto-assigned when no specific spot code is set
        </div>
      </div>
    </div>
  );
}
