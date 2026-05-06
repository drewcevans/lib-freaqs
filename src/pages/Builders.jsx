import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './Builders.css';

// Freaqs columns: Name, Arrival Day, Arrival Time, Departure Day, Builder (yes/no), Car Info, Sleeping Situation
// Builders columns: Name, Team, Task, Instructions, Notes

const isBuilder = (val) => /^(yes|true|1|y)$/i.test((val || '').trim());

const TEAM_COLORS = [
  'var(--neon-purple)', 'var(--neon-cyan)', 'var(--neon-green)',
  'var(--neon-yellow)', 'var(--neon-pink)', 'var(--neon-orange)',
];

export default function Builders({ year }) {
  const freaqs   = useSheetData(year, SHEET_TABS.freaqs);
  const builders = useSheetData(year, SHEET_TABS.builders);

  if (freaqs.loading || builders.loading) return <LoadingState label="Loading build crew..." />;
  if (freaqs.error)   return <ErrorState message={freaqs.error} />;
  if (builders.error) return <ErrorState message={builders.error} />;

  // People from Freaqs marked as Builder
  const buildPeople = freaqs.data.filter((r) => isBuilder(r['Builder']));

  // Merge: match builders tab data by Name
  const builderDetails = {};
  builders.data.forEach((row) => {
    if (row['Name']) builderDetails[row['Name'].trim()] = row;
  });

  // Separate team-level instruction rows (rows with Instructions but no Task, or vice versa)
  const teamInstructions = {};
  builders.data.forEach((row) => {
    if (row['Team'] && row['Instructions'] && !row['Name']) {
      teamInstructions[row['Team']] = row['Instructions'];
    }
  });

  // Group builders by team
  const grouped = {};
  buildPeople.forEach((person) => {
    const details = builderDetails[person['Name']?.trim()] || {};
    const team = details['Team'] || 'Unassigned';
    if (!grouped[team]) grouped[team] = [];
    grouped[team].push({ ...person, ...details });
  });

  // Also include anyone in Builders tab not in Freaqs
  builders.data.forEach((row) => {
    if (!row['Name']) return;
    const alreadyIn = buildPeople.some((p) => p['Name']?.trim() === row['Name'].trim());
    if (!alreadyIn) {
      const team = row['Team'] || 'Unassigned';
      if (!grouped[team]) grouped[team] = [];
      grouped[team].push(row);
    }
  });

  const teamNames = Object.keys(grouped);

  if (buildPeople.length === 0 && builders.data.length === 0) return (
    <EmptyState icon="🎨" title="No build crew yet."
      hint="Mark people as Builder=Yes in the Freaqs tab, or add data to the Builders tab." />
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-orange" style={{ color: 'var(--neon-orange)', textShadow: '0 0 10px var(--neon-orange), 0 0 24px var(--neon-orange)' }}>
          Builders 🎨
        </h1>
        <p className="page-subtitle">Early crew making the palace happen — {year}</p>
      </div>

      <div className="builders-summary neon-card">
        <div className="builder-stat">
          <span style={{ color: 'var(--neon-orange)' }} className="builder-stat-num">{buildPeople.length || builders.data.filter(r => r['Name']).length}</span>
          <span className="builder-stat-label">Builders</span>
        </div>
        <div className="builder-stat">
          <span className="builder-stat-num neon-cyan">{teamNames.filter(t => t !== 'Unassigned').length}</span>
          <span className="builder-stat-label">Teams</span>
        </div>
      </div>

      {teamNames.map((team, ti) => {
        const color = TEAM_COLORS[ti % TEAM_COLORS.length];
        const members = grouped[team];
        const instructions = teamInstructions[team];

        return (
          <section key={team} className="builders-team-section">
            <div className="builders-team-header" style={{ '--team-color': color }}>
              <h2 className="builders-team-name">{team}</h2>
              <span className="builders-team-count">{members.length} member{members.length !== 1 ? 's' : ''}</span>
            </div>

            {instructions && (
              <div className="builders-instructions" style={{ borderColor: `color-mix(in srgb, ${color} 30%, transparent)` }}>
                <div className="builders-instructions-label" style={{ color }}>Build Instructions</div>
                <p className="builders-instructions-text">{instructions}</p>
              </div>
            )}

            <div className="builders-grid">
              {members.map((person, i) => (
                <BuilderCard key={i} person={person} color={color} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function BuilderCard({ person, color }) {
  return (
    <div className="builder-card neon-card" style={{ '--bcolor': color }}>
      <div className="builder-card-name" style={{ color }}>{person['Name'] || '—'}</div>
      {person['Task'] && (
        <div className="builder-task">
          <span className="builder-task-label">Task:</span>
          <span>{person['Task']}</span>
        </div>
      )}
      <div className="builder-arrival">
        {person['Arrival Day'] && (
          <span className="neon-cyan">Arrives {person['Arrival Day']}</span>
        )}
        {person['Arrival Time'] && (
          <span className="builder-time"> @ {person['Arrival Time']}</span>
        )}
      </div>
      {person['Notes'] && <p className="builder-notes">{person['Notes']}</p>}
    </div>
  );
}
