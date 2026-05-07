import { useState, useRef, useEffect } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { useIdentity } from '../context/IdentityContext';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import Modal from '../components/Modal';
import JoinCrewForm, { rowToForm } from '../components/JoinCrewForm';
import Avatar from '../components/Avatar';
import PickleCatGreeting from '../components/PickleCatGreeting';
import CountdownTimer from '../components/CountdownTimer';
import '../components/PickleCatGreeting.css';
import './Freaqs.css';

const ACCENTS = [
  '#c800ff', '#ff00c8', '#00f5ff', '#00ff88',
  '#f5ff00', '#ff6600', '#ff88ff', '#88ffcc', '#ffaa00',
];

const col       = (p, ...keys) => { for (const k of keys) { const v = (p[k] || '').trim(); if (v) return v; } return ''; };
const isBuilder = (val) => /^(yes|true|1|y)$/i.test((val || '').trim());
const getSets   = (p)   => [
  col(p, 'Set 1', 'set1'),
  col(p, 'Set 2', 'set2'),
  col(p, 'Set 3', 'set3'),
].filter(Boolean);

export default function Freaqs({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.freaqs);
  const { identity }             = useIdentity();
  const [joinOpen, setJoinOpen]  = useState(false);
  const [editOpen, setEditOpen]  = useState(false);
  const [prefillRow, setPrefillRow] = useState(null);
  const [formMode, setFormMode]  = useState('join');
  const [selected, setSelected]  = useState(null);
  const autoJoinRef              = useRef(false);

  // If the user is on the sheet but hasn't filled in arrival day, prompt them
  useEffect(() => {
    if (autoJoinRef.current || !identity?.sheetName || loading || !data.length) return;
    const myRow = data.find(r => (r['Name'] || '').trim() === identity.sheetName);
    if (myRow && !col(myRow, 'Arrival Day', 'arrivalDay')) {
      autoJoinRef.current = true;
      setPrefillRow(myRow);
      setFormMode('update');
      setJoinOpen(true);
    }
  }, [identity, data, loading]);

  if (loading) return <LoadingState label="Loading the crew..." />;
  if (error)   return <ErrorState message={error} />;

  const builders = data.filter(r => isBuilder(r['Builder']));
  const cars     = data.filter(r => (r['Car Info'] || '').trim());
  const openAir  = data.filter(r => (r['Sleeping Situation'] || '').trim() === 'Open Air');

  const handleEdit = (person) => {
    setPrefillRow(person);
    setFormMode('update');
    setSelected(null);
    setEditOpen(true);
  };

  const handleJoinOpen = () => {
    setPrefillRow(null);
    setFormMode('join');
    setJoinOpen(true);
  };

  return (
    <div className="page-container">
      <div className="freaqs-header">
        <div>
          <h1 className="page-title freaqs-title">Freaqs 💃🕺</h1>
          <p className="page-subtitle">Your Party Palace crew for {year}</p>
        </div>
        <button className="join-crew-btn" onClick={handleJoinOpen}>
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

      <CountdownTimer />
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
            <FreaqCard key={i} person={person} index={i} identity={identity}
                       onClick={() => setSelected({ person, index: i })} />
          ))}
        </div>
      )}

      {selected && (
        <Modal isOpen onClose={() => setSelected(null)}
               title={selected.person['Name'] || '?'}>
          <FreaqDetail person={selected.person} index={selected.index}
            identity={identity} onEdit={() => handleEdit(selected.person)} />
        </Modal>
      )}

      {/* Join / update form modal */}
      <Modal isOpen={joinOpen} onClose={() => setJoinOpen(false)}
             title={formMode === 'update' ? 'Update my vibe ✏️' : 'Join the Crew 🎪'}
             panelClass="modal-panel--wide">
        <JoinCrewForm
          onClose={() => setJoinOpen(false)}
          prefill={prefillRow ? rowToForm(prefillRow) : undefined}
          mode={formMode}
        />
      </Modal>

      {/* Edit my vibe modal (opened from FreaqDetail) */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}
             title="Edit my vibe ✏️" panelClass="modal-panel--wide">
        <JoinCrewForm
          onClose={() => setEditOpen(false)}
          prefill={prefillRow ? rowToForm(prefillRow) : undefined}
          mode="update"
        />
      </Modal>
    </div>
  );
}

function FreaqCard({ person, index, identity, onClick }) {
  const accent      = ACCENTS[index % ACCENTS.length];
  const builder     = isBuilder(person['Builder']);
  const sets        = getSets(person);
  const arrivalDay  = col(person, 'Arrival Day', 'arrivalDay');
  const arrivalTime = col(person, 'Arrival Time', 'arrivalTime');
  const departure   = col(person, 'Departure Day', 'departureDay');
  const meltTitle   = col(person, 'Melt Song Title', 'meltSongTitle');
  const meltArtist  = col(person, 'Melt Song Artist', 'meltSongArtist');
  const isMe        = identity?.sheetName && person['Name'] === identity.sheetName;

  return (
    <div className="freaq-card" style={{ '--accent': accent }} onClick={onClick}
         role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="freaq-card-glow" />

      <div className="freaq-card-top">
        <Avatar photo={isMe ? identity.photo : null} name={person['Name']} size="sm" />
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

function FreaqDetail({ person, index, identity, onEdit }) {
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
  const isMe        = identity?.sheetName && person['Name'] === identity.sheetName;

  const rows = [
    { icon: '💃', label: 'Arrival Day',      value: arrivalDay },
    { icon: '🕐', label: 'Arrival Time',      value: arrivalTime },
    { icon: '✌️', label: 'Leaving',           value: departure },
    { icon: '🏕️', label: 'Sleeping',          value: sleeping },
    { icon: '🚗', label: 'Car in camp',       value: bringingCar },
    { icon: '🔑', label: 'Car make & model',  value: carInfo },
    { icon: '🥗', label: 'Dietary',           value: dietary },
    { icon: '📞', label: 'Emergency contact', value: emergency },
    { icon: '💬', label: 'Anything else',     value: anything },
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

      {(meltTitle || meltArtist) && (
        <div className="freaq-music-section">
          <div className="freaq-music-heading">🔥 Face Melter</div>
          <div className="freaq-melt-song">
            {meltTitle && <span className="freaq-melt-title">&ldquo;{meltTitle}&rdquo;</span>}
            {meltArtist && <span className="freaq-melt-artist"> — {meltArtist}</span>}
          </div>
        </div>
      )}

      {isMe && (
        <button className="freaq-edit-btn" onClick={onEdit}>
          Edit my vibe ✏️
        </button>
      )}
    </div>
  );
}
