import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './BuildCrew.css';

// Expected columns: Name, Arrival Day, Arrival Time, Role, Skills, Notes

const ROLE_COLORS = {
  Lead:     'badge-purple',
  Setup:    'badge-cyan',
  Electric: 'badge-yellow',
  Decor:    'badge-pink',
  General:  'badge-green',
};

export default function BuildCrew({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.buildCrew);

  if (loading) return <LoadingState label="Loading build crew..." />;
  if (error) return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="🔧" title="Build crew TBD." hint="Add data to the Build Crew tab in your Google Sheet." />
  );

  const byRole = data.reduce((acc, person) => {
    const role = person['Role'] || 'General';
    if (!acc[role]) acc[role] = [];
    acc[role].push(person);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-orange" style={{ color: 'var(--neon-orange)', textShadow: '0 0 8px var(--neon-orange), 0 0 20px var(--neon-orange)' }}>
          Build Crew
        </h1>
        <p className="page-subtitle">Early arrivals building the palace — {year}</p>
      </div>

      <div className="crew-summary neon-card">
        <div className="crew-stat">
          <span className="crew-stat-num" style={{ color: 'var(--neon-orange)' }}>{data.length}</span>
          <span className="crew-stat-label">Crew Members</span>
        </div>
        <div className="crew-stat">
          <span className="crew-stat-num neon-cyan">{Object.keys(byRole).length}</span>
          <span className="crew-stat-label">Roles</span>
        </div>
      </div>

      {Object.entries(byRole).map(([role, members]) => (
        <div key={role} className="crew-section">
          <h2 className="crew-role-title">
            <span className={`badge ${ROLE_COLORS[role] || 'badge-cyan'}`}>{role}</span>
            <span className="crew-count">{members.length} member{members.length !== 1 ? 's' : ''}</span>
          </h2>
          <div className="crew-grid">
            {members.map((person, i) => (
              <CrewCard key={i} person={person} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CrewCard({ person }) {
  const skills = (person['Skills'] || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="crew-card neon-card">
      <div className="crew-name">{person['Name'] || '—'}</div>
      <div className="crew-arrival">
        {person['Arrival Day'] && (
          <span className="neon-cyan">{person['Arrival Day']}</span>
        )}
        {person['Arrival Time'] && (
          <span className="crew-time"> @ {person['Arrival Time']}</span>
        )}
      </div>
      {skills.length > 0 && (
        <div className="crew-skills">
          {skills.map((skill) => (
            <span key={skill} className="badge badge-purple">{skill}</span>
          ))}
        </div>
      )}
      {person['Notes'] && <div className="crew-notes">{person['Notes']}</div>}
    </div>
  );
}
