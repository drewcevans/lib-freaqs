import { useState, useEffect } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { useIdentity } from '../context/IdentityContext';
import { SHEET_TABS } from '../config/sheets';
import { post } from '../config/webhook';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import Avatar from '../components/Avatar';
import PickleCatGreeting from '../components/PickleCatGreeting';
import './SetList.css';

// Expected Set List sheet columns:
//   Artist, Day, Time, Stage, End Time, Going (csv), FishTotem (Yes/""), CatTotem (Yes/"")

const DAY_ORDER = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function timeToMins(t) {
  if (!t) return null;
  const clean = (t + '').replace(/\s*(am|pm)\s*/i, '').trim();
  const [h, m] = clean.split(':').map(Number);
  if (isNaN(h)) return null;
  const mins = h * 60 + (m || 0);
  return h < 6 ? mins + 1440 : mins;
}

function fmtTime(t) {
  if (!t) return '';
  const m = timeToMins(t);
  if (m === null) return t;
  const totalMins = m % 1440;
  const h  = Math.floor(totalMins / 60);
  const mn = totalMins % 60;
  return `${h % 12 || 12}:${String(mn).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const freaqName  = (r) => (r['Name']      || Object.values(r)[1] || '').trim();
const freaqPhoto = (r) => (r['Photo URL'] || Object.values(r)[3] || '').trim();

export default function SetList({ year }) {
  const { data: setData, loading, error } = useSheetData(year, SHEET_TABS.setList);
  const { data: freaqData }               = useSheetData(year, SHEET_TABS.freaqs);
  const { identity }                      = useIdentity();
  const [activeDay, setActiveDay]         = useState(null);

  // Toggle state — seeded from sheet data on load, updated optimistically on toggle
  const [goingMap, setGoingMap] = useState({});  // setKey → string[]
  const [fishMap,  setFishMap]  = useState({});  // setKey → boolean
  const [catMap,   setCatMap]   = useState({});  // setKey → boolean

  // Populate toggle maps from sheet data whenever data arrives
  useEffect(() => {
    if (!setData.length) return;
    const g = {}, f = {}, c = {};
    setData.forEach(row => {
      const key = `${row['Artist']}|${row['Day']}`;
      g[key] = (row['Going'] || '').split(',').map(s => s.trim()).filter(Boolean);
      f[key] = (row['FishTotem'] || '').toLowerCase().startsWith('y');
      c[key] = (row['CatTotem']  || '').toLowerCase().startsWith('y');
    });
    setGoingMap(g);
    setFishMap(f);
    setCatMap(c);
  }, [setData]);

  if (loading) return <LoadingState label="Loading sets..." />;
  if (error)   return <ErrorState message={error} />;
  if (!setData.length) return (
    <EmptyState icon="🎵" title="No sets listed yet."
      hint="Add sets to the 'Set List ⚡' tab in your Google Sheet." />
  );

  // Photo lookup by sheetName
  const photosByName = {};
  freaqData.forEach(r => {
    const name = freaqName(r);
    if (name) photosByName[name] = freaqPhoto(r);
  });

  // Sorted unique day list
  const days = [...new Set(
    setData.map(r => r['Day']).filter(Boolean).sort((a, b) => {
      const ia = DAY_ORDER.findIndex(d => a.includes(d));
      const ib = DAY_ORDER.findIndex(d => b.includes(d));
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })
  )];

  const defaultDay  = days.find(d => d.includes('Thu')) || days[0];
  const selectedDay = activeDay || defaultDay;

  const dayData = setData
    .filter(r => r['Day'] === selectedDay)
    .sort((a, b) => (timeToMins(a['Time']) ?? 0) - (timeToMins(b['Time']) ?? 0));

  // ── Helpers ─────────────────────────────────────────────────────────
  const setKey = (set) => `${set['Artist']}|${set['Day']}`;

  const getEffective = (set) => {
    const key = setKey(set);
    return {
      going:     goingMap[key] ?? (set['Going'] || '').split(',').map(s => s.trim()).filter(Boolean),
      fishTotem: fishMap[key]  ?? (set['FishTotem'] || '').toLowerCase().startsWith('y'),
      catTotem:  catMap[key]   ?? (set['CatTotem']  || '').toLowerCase().startsWith('y'),
    };
  };

  const applyAndPost = (set, newGoing, newFish, newCat) => {
    const key = setKey(set);
    setGoingMap(m => ({ ...m, [key]: newGoing }));
    setFishMap(m  => ({ ...m, [key]: newFish  }));
    setCatMap(m   => ({ ...m, [key]: newCat   }));
    post({
      action:    'updateSet',
      artist:    set['Artist'],
      day:       set['Day'],
      going:     newGoing.join(','),
      fishTotem: newFish ? 'Yes' : '',
      catTotem:  newCat  ? 'Yes' : '',
    });
  };

  const toggleGoing = (set) => {
    if (!identity?.sheetName) {
      alert('Sign in first to mark yourself as going!');
      return;
    }
    const { going, fishTotem, catTotem } = getEffective(set);
    const me = identity.sheetName;
    const newGoing = going.includes(me)
      ? going.filter(n => n !== me)
      : [...going, me];
    applyAndPost(set, newGoing, fishTotem, catTotem);
  };

  const toggleFish = (set) => {
    const { going, fishTotem, catTotem } = getEffective(set);
    applyAndPost(set, going, !fishTotem, catTotem);
  };

  const toggleCat = (set) => {
    const { going, fishTotem, catTotem } = getEffective(set);
    applyAndPost(set, going, fishTotem, !catTotem);
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="page-container">
      <div className="sl-header">
        <h1 className="page-title neon-yellow">Set List 🎵</h1>
        <p className="page-subtitle">Where to rage</p>
      </div>

      <div className="sl-greeting">
        <PickleCatGreeting text="GET K HOLED" />
      </div>

      <div className="day-tabs">
        {days.map(day => (
          <button key={day}
            className={`day-tab sl-tab ${day === selectedDay ? 'active' : ''}`}
            onClick={() => setActiveDay(day)}>
            {day}
          </button>
        ))}
      </div>

      {dayData.length === 0 ? (
        <EmptyState icon="🎵" title={`No sets for ${selectedDay} yet.`} />
      ) : (
        <div className="sl-grid">
          {dayData.map((set, i) => {
            const { going, fishTotem, catTotem } = getEffective(set);
            const iAmGoing = identity?.sheetName
              ? going.includes(identity.sheetName)
              : false;
            return (
              <SetCard
                key={i}
                set={set}
                going={going}
                iAmGoing={iAmGoing}
                fishTotem={fishTotem}
                catTotem={catTotem}
                photosByName={photosByName}
                identity={identity}
                onGoing={() => toggleGoing(set)}
                onFish={() => toggleFish(set)}
                onCat={() => toggleCat(set)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function SetCard({
  set, going, iAmGoing, fishTotem, catTotem,
  photosByName, identity, onGoing, onFish, onCat,
}) {
  return (
    <div className={`sl-card neon-card ${iAmGoing ? 'sl-card--going' : ''}`}>

      <div className="sl-card-meta">
        {set['Time'] && (
          <span className="sl-time neon-yellow">
            {fmtTime(set['Time'])}
            {set['End Time'] && (
              <span className="sl-end-time"> → {fmtTime(set['End Time'])}</span>
            )}
          </span>
        )}
        {set['Stage'] && <span className="sl-stage">📍 {set['Stage']}</span>}
      </div>

      <div className="sl-artist">{set['Artist'] || '—'}</div>

      {going.length > 0 && (
        <div className="sl-going-crew">
          {going.map(name => {
            const photo = photosByName[name]
              || (identity?.sheetName === name ? identity?.photo : '');
            return (
              <span key={name} className="sl-crew-avatar" title={name}>
                <Avatar photo={photo} name={name} size="sm" />
              </span>
            );
          })}
          <span className="sl-going-label">{going.length} going</span>
        </div>
      )}

      {(fishTotem || catTotem) && (
        <div className="sl-totem-row">
          {fishTotem && <span className="sl-totem-badge sl-totem--fish">🐟 Fish Totem</span>}
          {catTotem  && <span className="sl-totem-badge sl-totem--cat">😺 Cat Totem</span>}
        </div>
      )}

      <div className="sl-actions">
        <button
          className={`sl-btn sl-btn--going ${iAmGoing ? 'active' : ''}`}
          onClick={onGoing}
          aria-label={iAmGoing ? "Remove from going" : "I'm going"}
        >
          <span className="sl-btn-icon">⚡</span>
          <span className="sl-btn-label">{iAmGoing ? "I'm Going" : "Going?"}</span>
          {going.length > 0 && (
            <span className="sl-btn-count">{going.length}</span>
          )}
        </button>

        <button
          className={`sl-btn sl-btn--fish ${fishTotem ? 'active' : ''}`}
          onClick={onFish}
          aria-label={fishTotem ? "Remove fish totem" : "Bring fish totem"}
          title="Fish totem"
        >
          <span className="sl-btn-icon">🐟</span>
        </button>

        <button
          className={`sl-btn sl-btn--cat ${catTotem ? 'active' : ''}`}
          onClick={onCat}
          aria-label={catTotem ? "Remove cat totem" : "Bring cat totem"}
          title="Cat totem"
        >
          <span className="sl-btn-icon">😺</span>
        </button>
      </div>
    </div>
  );
}
