import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './Sets.css';

// Expected columns: Person, Artist, Day, Stage, Start Time, End Time, Notes
// Start/End Time as 24h strings like "22:30"

const PERSON_COLORS = [
  'var(--neon-purple)', 'var(--neon-pink)', 'var(--neon-cyan)',
  'var(--neon-green)', 'var(--neon-yellow)', 'var(--neon-orange)',
  '#ff88ff', '#88ffcc', '#88ccff',
];

function timeToMinutes(t) {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  // Treat times before 6am as next day (so midnight = 1440, 2am = 1560)
  const mins = h * 60 + (m || 0);
  return h < 6 ? mins + 1440 : mins;
}

function minutesToDisplay(mins) {
  const normalized = mins % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export default function Sets({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.sets);
  const [activeDay, setActiveDay] = useState(null);
  const [hoveredArtist, setHoveredArtist] = useState(null);

  if (loading) return <LoadingState label="Loading sets..." />;
  if (error) return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="🎵" title="No sets picked yet." hint="Add data to the Sets tab in your Google Sheet." />
  );

  const days = [...new Set(data.map((r) => r['Day']).filter(Boolean))];
  const selectedDay = activeDay || days[0];
  const dayData = data.filter((r) => r['Day'] === selectedDay);

  const people = [...new Set(data.map((r) => r['Person']).filter(Boolean))];
  const personColorMap = Object.fromEntries(people.map((p, i) => [p, PERSON_COLORS[i % PERSON_COLORS.length]]));

  // Artist pick counts (across all days)
  const artistCounts = data.reduce((acc, r) => {
    const a = r['Artist'];
    if (a) acc[a] = (acc[a] || []).concat(r['Person']);
    return acc;
  }, {});
  const sharedArtists = Object.entries(artistCounts)
    .filter(([, p]) => p.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  // Timeline bounds for selected day
  const dayTimes = dayData.map((r) => [timeToMinutes(r['Start Time']), timeToMinutes(r['End Time'])]).flat().filter(Boolean);
  const minTime = dayTimes.length ? Math.min(...dayTimes) - 30 : 18 * 60;
  const maxTime = dayTimes.length ? Math.max(...dayTimes) + 30 : 30 * 60;
  const span = maxTime - minTime || 1;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-green">Sets</h1>
        <p className="page-subtitle">Most anticipated sets — Party Palace {year}</p>
      </div>

      {sharedArtists.length > 0 && (
        <section className="shared-section">
          <h2 className="section-title neon-pink" style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
            🔥 Group Favorites
          </h2>
          <div className="shared-grid">
            {sharedArtists.map(([artist, pickers]) => (
              <div key={artist} className="shared-card neon-card"
                onMouseEnter={() => setHoveredArtist(artist)}
                onMouseLeave={() => setHoveredArtist(null)}
                style={{ borderColor: hoveredArtist === artist ? 'var(--neon-pink)' : undefined }}
              >
                <div className="shared-artist">{artist}</div>
                <div className="shared-pickers">
                  {pickers.map((p) => (
                    <span key={p} className="picker-dot" style={{ background: personColorMap[p], boxShadow: `0 0 6px ${personColorMap[p]}` }} title={p} />
                  ))}
                  <span className="picker-count">{pickers.length} picking</span>
                </div>
                <div className="picker-names">{pickers.join(', ')}</div>
              </div>
            ))}
          </div>
          <hr className="neon-divider" />
        </section>
      )}

      <section>
        <div className="sets-header-row">
          <h2 className="section-title neon-cyan" style={{ fontSize: '0.9rem' }}>Timeline</h2>
          <div className="day-tabs" style={{ marginBottom: 0 }}>
            {days.map((day) => (
              <button
                key={day}
                className={`day-tab sets-tab ${day === selectedDay ? 'active' : ''}`}
                onClick={() => setActiveDay(day)}
              >{day}</button>
            ))}
          </div>
        </div>

        <div className="legend">
          {people.map((p) => (
            <div key={p} className="legend-item">
              <span className="legend-dot" style={{ background: personColorMap[p], boxShadow: `0 0 6px ${personColorMap[p]}` }} />
              <span className="legend-name">{p}</span>
            </div>
          ))}
        </div>

        {dayData.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No picks for this day.</p>
        ) : (
          <div className="timeline-wrap">
            <TimeAxis minTime={minTime} maxTime={maxTime} />
            <div className="timeline-rows">
              {dayData.map((set, i) => {
                const start = timeToMinutes(set['Start Time']);
                const end = timeToMinutes(set['End Time']);
                const hasTime = start !== null && end !== null;
                const color = personColorMap[set['Person']] || 'var(--neon-cyan)';
                const left = hasTime ? `${((start - minTime) / span) * 100}%` : '0%';
                const width = hasTime ? `${((end - start) / span) * 100}%` : '100%';

                return (
                  <div key={i} className="timeline-row">
                    <div className="row-person" style={{ color }}>{set['Person']}</div>
                    <div className="row-track">
                      <div
                        className="set-block"
                        style={{ left, width, background: color, boxShadow: `0 0 12px ${color}` }}
                        title={`${set['Artist']} — ${set['Start Time']} to ${set['End Time']}`}
                      >
                        <span className="set-block-label">{set['Artist']}</span>
                        {set['Stage'] && <span className="set-block-stage">{set['Stage']}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <hr className="neon-divider" />

      <section>
        <h2 className="section-title neon-purple" style={{ fontSize: '0.9rem', marginBottom: '14px' }}>All Picks</h2>
        <div className="all-picks-grid">
          {people.map((person) => {
            const picks = data.filter((r) => r['Person'] === person);
            const color = personColorMap[person];
            return (
              <div key={person} className="person-picks neon-card" style={{ borderColor: `color-mix(in srgb, ${color} 25%, transparent)` }}>
                <div className="person-picks-name" style={{ color }}>{person}</div>
                <div className="person-picks-list">
                  {picks.map((p, i) => (
                    <div key={i} className="pick-item">
                      <span className="pick-artist">{p['Artist']}</span>
                      {p['Day'] && <span className="pick-day badge badge-purple">{p['Day']}</span>}
                      {p['Stage'] && <span className="pick-stage">{p['Stage']}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TimeAxis({ minTime, maxTime }) {
  const hours = [];
  const startHour = Math.floor(minTime / 60);
  const endHour = Math.ceil(maxTime / 60);
  for (let h = startHour; h <= endHour; h++) {
    const mins = h * 60;
    if (mins >= minTime && mins <= maxTime) {
      const pct = ((mins - minTime) / (maxTime - minTime)) * 100;
      hours.push({ pct, label: minutesToDisplay(mins) });
    }
  }
  return (
    <div className="time-axis">
      {hours.map(({ pct, label }) => (
        <div key={pct} className="time-tick" style={{ left: `${pct}%` }}>
          <span className="time-tick-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
