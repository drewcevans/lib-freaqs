import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import Modal from '../components/Modal';
import JoinCrewForm from '../components/JoinCrewForm';
import PickleCatGreeting from '../components/PickleCatGreeting';
import '../components/PickleCatGreeting.css';
import './Freaqs.css';

// Deterministic accent color per card index
const ACCENTS = [
  '#c800ff', '#ff00c8', '#00f5ff', '#00ff88',
  '#f5ff00', '#ff6600', '#ff88ff', '#88ffcc', '#ffaa00',
];

const isBuilder = (val) => /^(yes|true|1|y)$/i.test((val || '').trim());

// Expected columns: Name, Arrival Day, Arrival Time, Departure Day, Builder, Car Info, Sleeping Situation

export default function Freaqs({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.freaqs);
  const [joinOpen, setJoinOpen] = useState(false);

  if (loading) return <LoadingState label="Loading the crew..." />;
  if (error)   return <ErrorState message={error} />;

  const builders = data.filter((r) => isBuilder(r['Builder']));
  const cars = data.filter((r) => (r['Car Info'] || '').trim());

  return (
    <div className="page-container">
      {/* Header */}
      <div className="freaqs-header">
        <div>
          <h1 className="page-title freaqs-title">Freaqs 💃🕺</h1>
          <p className="page-subtitle">Your Party Palace crew for {year}</p>
        </div>
        <button className="join-crew-btn" onClick={() => setJoinOpen(true)}>
          Join the Crew 🎪
        </button>
      </div>

      {/* Stats bar */}
      {data.length > 0 && (
        <div className="freaqs-stats">
          <div className="freaq-stat">
            <span className="freaq-stat-num neon-cyan">{data.length}</span>
            <span className="freaq-stat-label">Total Freaqs</span>
          </div>
          <div className="freaq-stat">
            <span className="freaq-stat-num neon-green">{builders.length}</span>
            <span className="freaq-stat-label">Builders</span>
          </div>
          <div className="freaq-stat">
            <span className="freaq-stat-num neon-yellow">{cars.length}</span>
            <span className="freaq-stat-label">Rolling In</span>
          </div>
        </div>
      )}

      {/* Pickle × Cat mascot */}
      <PickleCatGreeting />

      {/* Crew grid */}
      {data.length === 0 ? (
        <EmptyState
          icon="💃"
          title="No freaqs yet — be the first to join!"
          hint="Click 'Join the Crew' above to add yourself."
        />
      ) : (
        <div className="freaqs-grid">
          {data.map((person, i) => (
            <FreaqCard key={i} person={person} index={i} />
          ))}
        </div>
      )}

      {/* Join the Crew modal */}
      <Modal isOpen={joinOpen} onClose={() => setJoinOpen(false)}
             title="Join the Crew 🎪" panelClass="modal-panel--wide">
        <JoinCrewForm onClose={() => setJoinOpen(false)} />
      </Modal>
    </div>
  );
}

function FreaqCard({ person, index }) {
  const accent = ACCENTS[index % ACCENTS.length];
  const builder = isBuilder(person['Builder']);

  return (
    <div className="freaq-card" style={{ '--accent': accent }}>
      <div className="freaq-card-glow" />

      <div className="freaq-card-top">
        <span className="freaq-name">{person['Name'] || '?'}</span>
        {builder && <span className="freaq-builder-badge">🎨 Builder</span>}
      </div>

      <div className="freaq-details">
        {(person['Arrival Day'] || person['Arrival Time']) && (
          <div className="freaq-detail">
            <span className="freaq-detail-icon">💃</span>
            <span>
              {[person['Arrival Day'], person['Arrival Time'] && `@ ${person['Arrival Time']}`]
                .filter(Boolean).join(' ')}
            </span>
          </div>
        )}
        {person['Departure Day'] && (
          <div className="freaq-detail">
            <span className="freaq-detail-icon">✌️</span>
            <span>Leaves {person['Departure Day']}</span>
          </div>
        )}
        {person['Sleeping Situation'] && (
          <div className="freaq-detail">
            <span className="freaq-detail-icon">🏕️</span>
            <span>{person['Sleeping Situation']}</span>
          </div>
        )}
        {person['Car Info'] && (
          <div className="freaq-detail">
            <span className="freaq-detail-icon">🚗</span>
            <span>{person['Car Info']}</span>
          </div>
        )}
      </div>
    </div>
  );
}
