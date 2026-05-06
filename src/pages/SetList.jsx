import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './SetList.css';

// Expected columns: Artist, Day, Time, Stage, End Time (optional), Going (comma-separated names)
// "I'm going" is tracked locally in localStorage — Going column shows who submitted via sheet

const DAY_ORDER_HINT = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function timeToMins(t) {
  if (!t) return null;
  const [h, m] = (t + '').replace(/[ap]m/i, '').split(':').map(Number);
  if (isNaN(h)) return null;
  const mins = h * 60 + (m || 0);
  return h < 6 ? mins + 1440 : mins; // treat before 6am as next day
}

function fmtTime(t) {
  if (!t) return '';
  const m = timeToMins(t);
  if (!m) return t;
  const h = Math.floor((m % 1440) / 60);
  const mn = (m % 1440) % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(mn).padStart(2,'0')} ${ap}`;
}

const PERSON_COLORS = [
  '#c800ff','#ff00c8','#00f5ff','#00ff88',
  '#f5ff00','#ff6600','#ff88ff','#88ffcc',
];

export default function SetList({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.setList);
  const [going, setGoing] = useLocalStorage(`lib-going-${year}`, {});
  const [activeDay, setActiveDay] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'timeline'

  if (loading) return <LoadingState label="Loading sets..." />;
  if (error)   return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="⚡" title="No sets listed yet."
      hint="Add sets to the Set List tab in your Google Sheet." />
  );

  const days = [...new Set(
    data.map((r) => r['Day']).filter(Boolean)
      .sort((a, b) => {
        const ia = DAY_ORDER_HINT.findIndex(d => a.includes(d));
        const ib = DAY_ORDER_HINT.findIndex(d => b.includes(d));
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      })
  )];

  const selectedDay = activeDay || days[0];
  const dayData = data
    .filter((r) => r['Day'] === selectedDay)
    .sort((a, b) => (timeToMins(a['Time']) || 0) - (timeToMins(b['Time']) || 0));

  // Who's going per set (from sheet + local)
  const goingKey = (set) => `${set['Artist']}|${set['Day']}|${set['Time']}`;
  const toggleGoing = (set) => {
    const k = goingKey(set);
    setGoing({ ...going, [k]: !going[k] });
  };
  const iAmGoing = (set) => !!going[goingKey(set)];

  // Crew going per set from sheet
  const crewGoing = (set) =>
    (set['Going'] || '').split(',').map(s => s.trim()).filter(Boolean);

  // Timeline bounds
  const dayTimes = dayData.map(r => [timeToMins(r['Time']), timeToMins(r['End Time'])]).flat().filter(Boolean);
  const tMin = dayTimes.length ? Math.min(...dayTimes) - 20 : 18 * 60;
  const tMax = dayTimes.length ? Math.max(...dayTimes) + 80 : 30 * 60;
  const span = tMax - tMin || 1;

  // People represented in Going column for timeline
  const allPeople = [...new Set(
    data.flatMap(r => crewGoing(r))
  )].filter(Boolean);
  const personColor = Object.fromEntries(
    allPeople.map((p, i) => [p, PERSON_COLORS[i % PERSON_COLORS.length]])
  );

  return (
    <div className="page-container">
      <div className="setlist-header">
        <div>
          <h1 className="page-title neon-yellow">Set List ⚡</h1>
          <p className="page-subtitle">Where the crew will be — {year}</p>
        </div>
        <div className="setlist-view-toggle">
          <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}>List</button>
          <button className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}>Timeline</button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="day-tabs">
        {days.map(day => (
          <button key={day}
            className={`day-tab setlist-tab ${day === selectedDay ? 'active' : ''}`}
            onClick={() => setActiveDay(day)}>{day}</button>
        ))}
      </div>

      {/* ── List view ── */}
      {viewMode === 'list' && (
        <div className="sets-list">
          {dayData.map((set, i) => {
            const going2 = iAmGoing(set);
            const crew = crewGoing(set);
            return (
              <div key={i} className={`set-row neon-card ${going2 ? 'set-row--going' : ''}`}>
                <div className="set-time-col">
                  <span className="set-time neon-yellow">{fmtTime(set['Time'])}</span>
                  {set['End Time'] && (
                    <span className="set-end-time">→ {fmtTime(set['End Time'])}</span>
                  )}
                </div>
                <div className="set-info">
                  <div className="set-artist">{set['Artist'] || '—'}</div>
                  {set['Stage'] && <div className="set-stage">📍 {set['Stage']}</div>}
                  {crew.length > 0 && (
                    <div className="set-crew">
                      {crew.map((name) => (
                        <span key={name} className="set-crew-dot"
                          style={{ background: personColor[name] || 'var(--neon-purple)',
                                   boxShadow: `0 0 5px ${personColor[name] || 'var(--neon-purple)'}` }}
                          title={name}/>
                      ))}
                      <span className="set-crew-names">{crew.join(', ')}</span>
                    </div>
                  )}
                </div>
                <button
                  className={`going-btn ${going2 ? 'going-btn--active' : ''}`}
                  onClick={() => toggleGoing(set)}
                >
                  {going2 ? '✓ Going' : "I'm Going"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Timeline view ── */}
      {viewMode === 'timeline' && (
        <div className="timeline-view">
          {allPeople.length > 0 && (
            <div className="tl-legend">
              {allPeople.map(p => (
                <div key={p} className="tl-legend-item">
                  <span className="tl-legend-dot"
                    style={{ background: personColor[p], boxShadow: `0 0 6px ${personColor[p]}` }}/>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}

          <div className="tl-wrap">
            {/* Time axis */}
            <div className="tl-axis">
              {Array.from({ length: Math.ceil((tMax - tMin) / 60) + 1 }, (_, i) => {
                const mins = tMin + i * 60;
                const pct = ((mins - tMin) / span) * 100;
                const h = Math.floor((mins % 1440) / 60);
                const ap = h >= 12 ? 'PM' : 'AM';
                const label = `${h % 12 || 12} ${ap}`;
                return pct <= 100 ? (
                  <div key={mins} className="tl-tick" style={{ left: `${pct}%` }}>
                    <span className="tl-tick-label">{label}</span>
                  </div>
                ) : null;
              })}
            </div>

            {/* Per-person rows */}
            {allPeople.map((person) => {
              const personSets = dayData.filter(s => crewGoing(s).includes(person));
              const color = personColor[person];
              return (
                <div key={person} className="tl-row">
                  <div className="tl-row-label" style={{ color }}>{person}</div>
                  <div className="tl-row-track">
                    {personSets.map((set, si) => {
                      const start = timeToMins(set['Time']) || tMin;
                      const end   = timeToMins(set['End Time']) || start + 60;
                      const left  = `${((start - tMin) / span) * 100}%`;
                      const width = `${Math.max(((end - start) / span) * 100, 2)}%`;
                      return (
                        <div key={si} className="tl-block"
                          style={{ left, width, background: color, boxShadow: `0 0 10px ${color}` }}
                          title={`${set['Artist']} — ${fmtTime(set['Time'])}`}>
                          <span className="tl-block-label">{set['Artist']}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {allPeople.length === 0 && (
              <p className="tl-empty">Add names to the Going column in your sheet to see the crew timeline.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
