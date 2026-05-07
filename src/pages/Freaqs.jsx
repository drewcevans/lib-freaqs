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

// Named-key lookup — tries each key in order, returns first non-empty value
const col = (p, ...keys) => {
  for (const k of keys) { const v = (p[k] || '').trim(); if (v) return v; }
  return '';
};
// Positional lookup by 0-based column index
// Column map: A=0 Timestamp, B=1 Name, C=2 DisplayName, D=3 PhotoURL,
//   E=4 ArrivalDay, F=5 ArrivalTime, G=6 DepartureDay, H=7 Builder,
//   I=8 CarPlacement, J=9 CarMakeModel, K=10 Sleeping, L=11 Dietary,
//   M=12 Emergency, N=13 Set1, O=14 Set2, P=15 Set3,
//   Q=16 MeltTitle, R=17 MeltArtist, S=18 AnythingElse
const idx = (p, i) => (Object.values(p)[i] || '').trim();

const getSheetName   = (p) => col(p, 'Name', 'name')                         || idx(p, 1);
const getDisplayName = (p) => col(p, 'Display Name', 'displayName')          || idx(p, 2) || getSheetName(p) || '?';
const getPhotoUrl    = (p) => col(p, 'Photo URL', 'photoUrl')                || idx(p, 3);

const isBuilder = (val) => /^(yes|true|1|y)$/i.test((val || '').trim());

// Sets: N=13, O=14, P=15
const getSets = (p) => [
  col(p, 'Set 1', 'set1') || idx(p, 13),
  col(p, 'Set 2', 'set2') || idx(p, 14),
  col(p, 'Set 3', 'set3') || idx(p, 15),
].filter(Boolean);

export default function Freaqs({ year }) {
  const { data, loading, error }    = useSheetData(year, SHEET_TABS.freaqs);
  const { identity, freshlyOnboarded } = useIdentity();
  const [editOpen, setEditOpen]     = useState(false);
  const [prefillRow, setPrefillRow] = useState(null);
  const [selected, setSelected]     = useState(null);
  const autoJoinRef                 = useRef(false);

  // Auto-open "update vibe" only right after first onboarding — never on page refresh
  useEffect(() => {
    if (autoJoinRef.current || !freshlyOnboarded || !identity?.sheetName || loading || !data.length) return;
    const myRow = data.find(r => getSheetName(r) === identity.sheetName);
    if (myRow && !(col(myRow, 'Arrival Day', 'arrivalDay') || idx(myRow, 4))) {
      autoJoinRef.current = true;
      setPrefillRow(myRow);
      setEditOpen(true);
    }
  }, [identity, freshlyOnboarded, data, loading]);

  if (loading) return <LoadingState label="Loading the crew..." />;
  if (error)   return <ErrorState message={error} />;

  const builders = data.filter(r => isBuilder(col(r, 'Builder') || idx(r, 7)));
  const cars     = data.filter(r => col(r, 'Car Make/Model', 'Car Info', 'carDetails') || idx(r, 9));
  const openAir  = data.filter(r =>
    (col(r, 'Where will you sleep?', 'Sleeping Situation', 'sleepingSituation') || idx(r, 10)) === 'Open Air'
  );

  const handleEdit = (person) => {
    setPrefillRow(person);
    setSelected(null);
    setEditOpen(true);
  };

  return (
    <div className="page-container">
      <div className="freaqs-header">
        <h1 className="page-title freaqs-title">Freaqs 💃🕺</h1>
        <p className="page-subtitle">Your rage crew for {year}</p>
      </div>

      <CountdownTimer />

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
          title="No freaqs yet!"
          hint="Join the crew via your profile badge in the top right."
        />
      ) : (
        <div className="freaqs-grid">
          {data.map((person, i) => (
            <FreaqCard key={i} person={person} index={i} identity={identity}
                       onClick={() => {
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                         setSelected({ person, index: i });
                       }} />
          ))}
        </div>
      )}

      {selected && (
        <Modal isOpen onClose={() => setSelected(null)}
               title={getDisplayName(selected.person)}>
          <FreaqDetail person={selected.person} index={selected.index}
            identity={identity} onEdit={() => handleEdit(selected.person)} />
        </Modal>
      )}

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
  const builderVal  = col(person, 'Builder')                                     || idx(person, 7);
  const builder     = isBuilder(builderVal);
  const arrivalDay  = col(person, 'Arrival Day', 'arrivalDay')                   || idx(person, 4);
  const arrivalTime = col(person, 'Arrival Time', 'arrivalTime')                 || idx(person, 5);
  const departure   = col(person, 'Departure Day', 'departureDay')               || idx(person, 6);
  const meltTitle   = col(person, 'Melt Song Title', 'meltSongTitle')            || idx(person, 16);
  const meltArtist  = col(person, 'Melt Song Artist', 'meltSongArtist')          || idx(person, 17);
  const sets        = getSets(person);
  const photoUrl    = getPhotoUrl(person);
  const isMe        = identity?.sheetName && getSheetName(person) === identity.sheetName;

  return (
    <div className="freaq-card" style={{ '--accent': accent }} onClick={onClick}
         role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="freaq-card-glow" />

      <div className="freaq-card-top">
        <Avatar photo={photoUrl || (isMe ? identity.photo : null)} name={getDisplayName(person)} size="sm" />
        <span className="freaq-name">{getDisplayName(person)}</span>
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
  const builderVal  = col(person, 'Builder')                                                              || idx(person, 7);
  const builder     = isBuilder(builderVal);
  const sets        = getSets(person);
  const photoUrl    = getPhotoUrl(person);
  const arrivalDay  = col(person, 'Arrival Day', 'arrivalDay')                                           || idx(person, 4);
  const arrivalTime = col(person, 'Arrival Time', 'arrivalTime')                                         || idx(person, 5);
  const departure   = col(person, 'Departure Day', 'departureDay')                                       || idx(person, 6);
  const sleeping    = col(person, 'Where will you sleep?', 'Sleeping Situation', 'sleepingSituation')    || idx(person, 10);
  const bringingCar = col(person, 'Car Placement', 'Bringing Car', 'bringingCar')                       || idx(person, 8);
  const carInfo     = col(person, 'Car Make/Model', 'Car Info', 'carDetails')                           || idx(person, 9);
  const dietary     = col(person, 'Dietary needs or restrictions', 'Dietary', 'dietaryNeeds', 'dietary') || idx(person, 11);
  const emergency   = col(person, 'Emergency contact', 'Emergency Contact', 'emergencyContact')          || idx(person, 12);
  const meltTitle   = col(person, 'Melt Song Title', 'meltSongTitle')                                   || idx(person, 16);
  const meltArtist  = col(person, 'Melt Song Artist', 'meltSongArtist')                                 || idx(person, 17);
  const anything    = col(person, 'Anything else to know about you?', 'Anything Else', 'anythingElse')  || idx(person, 18);
  const isMe        = identity?.sheetName && getSheetName(person) === identity.sheetName;
  const displayPhoto = photoUrl || (isMe ? identity.photo : null);

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
      {displayPhoto && (
        <div className="freaq-detail-photo">
          <Avatar photo={displayPhoto} name={getDisplayName(person)} size="lg" />
        </div>
      )}

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
