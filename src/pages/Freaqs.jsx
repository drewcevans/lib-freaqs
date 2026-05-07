import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import Modal from '../components/Modal';
import JoinCrewForm from '../components/JoinCrewForm';
import PickleCatGreeting from '../components/PickleCatGreeting';
import '../components/PickleCatGreeting.css';
import './Freaqs.css';

// Expected sheet columns:
// Name, Arrival Day, Arrival Time, Departure Day, Builder, Bringing Car, Car Info,
// Sleeping Situation, Dietary, Emergency Contact,
// Set 1, Set 2, Set 3, Melt Song Title, Melt Song Artist, Anything Else

const ACCENTS = [
  '#c800ff', '#ff00c8', '#00f5ff', '#00ff88',
  '#f5ff00', '#ff6600', '#ff88ff', '#88ffcc', '#ffaa00',
];

const isBuilder = (val) => /^(yes|true|1|y)$/i.test((val || '').trim());
const getSets   = (p)   => [
  col(p, 'Set 1', 'set1'),
  col(p, 'Set 2', 'set2'),
  col(p, 'Set 3', 'set3'),
].filter(Boolean);
const col       = (p, ...keys) => { for (const k of keys) { const v = (p[k] || '').trim(); if (v) return v; } return ''; };

export default function Freaqs({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.freaqs);
  const [joinOpen, setJoinOpen]   = useState(false);
  const [selected, setSelected]   = useState(null);

  if (loading) return <LoadingState label="Loading the crew..." />;
  if (error)   return <ErrorState message={error} />;

  const builders = data.filter(r => isBuilder(r['Builder']));
  const cars     = data.filter(r => (r['Car Info'] || '').trim());
  const openAir  = data.filter(r => (r['Sleeping Situation'] || '').trim() === 'Open Air');

  return (
    <div className="page-container">
      <div className="freaqs-header">
        <div>
          <h1 className="page-title freaqs-title">Freaqs 💃🕺</h1>
          <p className="page-subtitle">Your Party Palace crew for {year}</p>
        </div>
        <button className="join-crew-btn" onClick={() => setJoinOpen(true)}>
          Join the Crew 🎪
        </button>
      </div>

      {data.length > 0 && (
        <div className="freaqs-stats">
          <div className="freaq-stat">
            <span className="freaq-stat-num neon-cyan">{data.length}</span>
            <span className="freaq-stat-label">Total Freaqs</span>
          </div>
          <div className="freaq-stat">
            <span className="freaq-stat-num neon-green">{builders.length}</span>
            <span className="freaq-stat-label">Builders 🎨</span>
          </div>
          <div className="freaq-stat">
            <span className="freaq-stat-num neon-yellow">{cars.length}</span>
            <span className="freaq-stat-label">Cars in Camp 🚗</span>
          </div>
          <div className="freaq-stat">
            <span className="freaq-stat-num neon-purple">{openAir.length}</span>
            <span className="freaq-stat-label">Under Stars ⭐</span>
          </div>
        </div>
      )}

      <PickleCatGreeting />

      {data.length === 0 ? (
        <EmptyState
          icon="💃"
          title="No freaqs yet — be the first to join!"
          hint="Click 'Join the Crew' above to add yourself."
        />
      ) : (
        <div className="freaqs-grid">
          {data.map((person, i) => (
            <FreaqCard key={i} person={person} index={i}
                       onClick={() => setSelected({ person, index: i })} />
          ))}
        </div>
      )}

      {selected && (
        <Modal isOpen onClose={() => setSelected(null)}
               title={selected.person['Name'] || '?'}>
          <FreaqDetail person={selected.person} index={selected.index} />
        </Modal>
      )}

      <Modal isOpen={joinOpen} onClose={() => setJoinOpen(false)}
             title="Join the Crew 🎪" panelClass="modal-panel--wide">
        <JoinCrewForm onClose={() => setJoinOpen(false)} />
      </Modal>
    </div>
  );
}

function FreaqCard({ person, index, onClick }) {
  const accent      = ACCENTS[index % ACCENTS.length];
  const builder     = isBuilder(person['Builder']);
  const sets        = getSets(person);
  const arrivalDay  = col(person, 'Arrival Day', 'arrivalDay');
  const arrivalTime = col(person, 'Arrival Time', 'arrivalTime');
  const departure   = col(person, 'Departure Day', 'departureDay');
  const meltTitle   = col(person, 'Melt Song Title', 'meltSongTitle');
  const meltArtist  = col(person, 'Melt Song Artist', 'meltSongArtist');

  return (
    <div className="freaq-card" style={{ '--accent': accent }} onClick={onClick}
         role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="freaq-card-glow" />

      <div className="freaq-card-top">
        <span className="freaq-name">{person['Name'] || '?'}</span>
        {builder && <span className="freaq-builder-badge">🎨 Builder</span>}
      </div>

      <div className="freaq-details">
        {arrivalDay && (
          <div className="freaq-detail">
            <span className="freaq-detail-icon">💃</span>
            <span>Arrives {arrivalDay}{arrivalTime && ` @ ${arrivalTime}`}</span>
          </div>
        )}
        {departure && (
          <div className="freaq-detail">
            <span className="freaq-detail-icon">✌️</span>
            <span>Leaves {departure}</span>
          </div>
        )}
        {sets.length > 0 && (
          <div className="freaq-detail">
            <span className="freaq-detail-icon">⚡</span>
            <span className="freaq-sets-preview">{sets.join(' · ')}</span>
          </div>
        )}
        {meltTitle && (
          <div className="freaq-detail">
            <span className="freaq-detail-icon">🔥</span>
            <span>
              &ldquo;{meltTitle}&rdquo;
              {meltArtist && ` — ${meltArtist}`}
            </span>
          </div>
        )}
      </div>

      <div className="freaq-card-tap">tap for full profile ↗</div>
    </div>
  );
}

function FreaqDetail({ person, index }) {
  const accent      = ACCENTS[index % ACCENTS.length];
  const builder     = isBuilder(person['Builder']);
  const sets        = getSets(person);
  const arrivalDay  = col(person, 'Arrival Day', 'arrivalDay');
  const arrivalTime = col(person, 'Arrival Time', 'arrivalTime');
  const departure   = col(person, 'Departure Day', 'departureDay');
  const sleeping    = col(person, 'Sleeping Situation', 'sleepingSituation');
  const bringingCar = col(person, 'Bringing Car', 'bringingCar');
  const carInfo     = col(person, 'Car Info', 'carDetails');
  const dietary     = col(person, 'Dietary', 'dietary');
  const emergency   = col(person, 'Emergency Contact', 'emergencyContact');
  const anything    = col(person, 'Anything Else', 'anythingElse');
  const meltTitle   = col(person, 'Melt Song Title', 'meltSongTitle');
  const meltArtist  = col(person, 'Melt Song Artist', 'meltSongArtist');

  const rows = [
    { icon: '💃', label: 'Arrival Day',       value: arrivalDay },
    { icon: '🕐', label: 'Arrival Time',       value: arrivalTime },
    { icon: '✌️', label: 'Leaving',            value: departure },
    { icon: '🏕️', label: 'Sleeping',           value: sleeping },
    { icon: '🚗', label: 'Car in camp',        value: bringingCar },
    { icon: '🔑', label: 'Car make & model',   value: carInfo },
    { icon: '🥗', label: 'Dietary',            value: dietary },
    { icon: '📞', label: 'Emergency contact',  value: emergency },
    { icon: '💬', label: 'Anything else',      value: anything },
  ].filter(r => r.value);

  return (
    <div className="freaq-detail-modal" style={{ '--accent': accent }}>
      {builder && (
        <span className="freaq-builder-badge freaq-builder-badge--modal">🎨 Builder</span>
      )}

      {rows.length > 0 && (
        <div className="freaq-detail-rows">
          {rows.map(({ icon, label, value }) => (
            <div key={label} className="freaq-detail-row">
              <span className="freaq-detail-row-icon">{icon}</span>
              <div>
                <div className="freaq-detail-row-label">{label}</div>
                <div className="freaq-detail-row-value">{value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sets.length > 0 && (
        <div className="freaq-music-section">
          <div className="freaq-music-heading">⚡ Top Sets</div>
          <div className="freaq-sets-list">
            {sets.map((s, i) => (
              <div key={i} className="freaq-set-item">{s}</div>
            ))}
          </div>
        </div>
      )}

      {(person['Melt Song Title'] || person['Melt Song Artist']) && (
        <div className="freaq-music-section">
          <div className="freaq-music-heading">🔥 Face Melter</div>
          <div className="freaq-melt-song">
            {person['Melt Song Title'] && (
              <span className="freaq-melt-title">&ldquo;{person['Melt Song Title']}&rdquo;</span>
            )}
            {person['Melt Song Artist'] && (
              <span className="freaq-melt-artist"> — {person['Melt Song Artist']}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
