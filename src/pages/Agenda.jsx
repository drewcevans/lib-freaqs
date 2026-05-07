import { useState, useEffect } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useIdentity } from '../context/IdentityContext';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import Avatar from '../components/Avatar';
import './Agenda.css';

const DAY_ORDER_HINT = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PERSON_COLORS  = [
  '#c800ff','#ff00c8','#00f5ff','#00ff88',
  '#f5ff00','#ff6600','#ff88ff','#88ffcc',
];

const FEST_START = new Date('2026-05-20T00:00:00');
const FEST_END   = new Date('2026-05-27T00:00:00');

function timeToMins(t) {
  if (!t) return null;
  const [h, m] = (t + '').replace(/[ap]m/i, '').split(':').map(Number);
  if (isNaN(h)) return null;
  const mins = h * 60 + (m || 0);
  return h < 6 ? mins + 1440 : mins;
}

function fmtTime(t) {
  if (!t) return '';
  const m = timeToMins(t);
  if (m == null) return t;
  const h  = Math.floor((m % 1440) / 60);
  const mn = (m % 1440) % 60;
  return `${h % 12 || 12}:${String(mn).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function isLiveNow(set, now) {
  const start = timeToMins(set['Time']);
  if (start == null) return false;
  const end      = timeToMins(set['End Time']) ?? start + 60;
  const nowMins  = now.getHours() * 60 + now.getMinutes();
  const effective = nowMins < 6 * 60 ? nowMins + 1440 : nowMins;
  return effective >= start - 5 && effective <= end;
}

function CrewChip({ name, identity, allPeople }) {
  const isMe = identity?.sheetName && name === identity.sheetName;
  if (isMe && identity.photo) {
    return (
      <span className="ag-crew-chip" title={name}>
        <Avatar photo={identity.photo} name={name} size="sm" />
      </span>
    );
  }
  const idx   = Math.max(allPeople.indexOf(name), 0);
  const color = PERSON_COLORS[idx % PERSON_COLORS.length];
  return (
    <span className="ag-crew-chip ag-crew-initial"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      title={name}>
      {(name[0] || '?').toUpperCase()}
    </span>
  );
}

export default function Agenda({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.setList);
  const [going]      = useLocalStorage(`lib-going-${year}`, {});
  const { identity } = useIdentity();
  const [activeDay, setActiveDay] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <LoadingState label="Loading agenda..." />;
  if (error)   return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="📅" title="No sets in the schedule yet."
      hint="Add sets to the Set List tab in your Google Sheet." />
  );

  const isFestival = now >= FEST_START && now < FEST_END;

  const days = [...new Set(
    data.map(r => r['Day']).filter(Boolean)
      .sort((a, b) => {
        const ia = DAY_ORDER_HINT.findIndex(d => a.includes(d));
        const ib = DAY_ORDER_HINT.findIndex(d => b.includes(d));
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      })
  )];

  const selectedDay = activeDay || days[0];
  const dayData     = data
    .filter(r => r['Day'] === selectedDay)
    .sort((a, b) => (timeToMins(a['Time']) || 0) - (timeToMins(b['Time']) || 0));

  const goingKey  = set => `${set['Artist']}|${set['Day']}|${set['Time']}`;
  const iAmGoing  = set => !!going[goingKey(set)];
  const crewNames = set => (set['Going'] || '').split(',').map(s => s.trim()).filter(Boolean);

  const allPeople = [...new Set(data.flatMap(r => crewNames(r)))].filter(Boolean);

  const liveNow = isFestival ? dayData.filter(s => isLiveNow(s, now)) : [];

  return (
    <div className="page-container">
      <div className="ag-header">
        <h1 className="page-title neon-cyan">Agenda 📅</h1>
        <p className="page-subtitle">Crew schedule for {year}</p>
      </div>

      {isFestival && liveNow.length > 0 && (
        <div className="ag-live-banner">
          <span className="ag-live-dot" />
          <span className="ag-live-label">LIVE NOW</span>
          <span className="ag-live-sets">{liveNow.map(s => s['Artist']).join(' · ')}</span>
        </div>
      )}

      <div className="day-tabs">
        {days.map(day => (
          <button key={day}
            className={`day-tab agenda-tab ${day === selectedDay ? 'active' : ''}`}
            onClick={() => setActiveDay(day)}>
            {day}
          </button>
        ))}
      </div>

      <div className="ag-sets">
        {dayData.map((set, i) => {
          const live     = isFestival && isLiveNow(set, now);
          const crew     = crewNames(set);
          const iGoing   = iAmGoing(set);
          const meInCrew = identity?.sheetName ? crew.includes(identity.sheetName) : false;
          const displayed = iGoing && identity?.sheetName && !meInCrew
            ? [...crew, identity.sheetName]
            : crew;

          return (
            <div key={i} className={`ag-set-row neon-card${live ? ' ag-set-row--live' : ''}${iGoing ? ' ag-set-row--going' : ''}`}>
              {live && <div className="ag-live-pill">LIVE</div>}
              <div className="ag-time-col">
                <span className="ag-time neon-yellow">{fmtTime(set['Time'])}</span>
                {set['End Time'] && (
                  <span className="ag-end-time">→ {fmtTime(set['End Time'])}</span>
                )}
              </div>
              <div className="ag-info">
                <div className="ag-artist">{set['Artist'] || '—'}</div>
                {set['Stage'] && <div className="ag-stage">📍 {set['Stage']}</div>}
              </div>
              <div className="ag-crew-col">
                {displayed.map(name => (
                  <CrewChip key={name} name={name} identity={identity} allPeople={allPeople} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
