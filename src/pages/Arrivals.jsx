import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import PickleCatGreeting from '../components/PickleCatGreeting';
import '../components/PickleCatGreeting.css';
import './Arrivals.css';

const DAY_ORDER = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_COLORS = {
  Wed: 'var(--neon-cyan)',
  Thu: 'var(--neon-green)',
  Fri: 'var(--neon-purple)',
  Sat: 'var(--neon-pink)',
  Sun: 'var(--neon-yellow)',
};

// Expected columns: Name, Arrival Day, Arrival Time, Departure Day, Spot, Notes
export default function Arrivals({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.arrivals);

  if (loading) return <LoadingState label="Loading arrivals..." />;
  if (error) return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState
      icon="🏕️"
      title="No arrival data yet for this year."
      hint="Add data to the Arrivals tab in your Google Sheet."
    />
  );

  const byDay = DAY_ORDER.reduce((acc, day) => {
    acc[day] = data.filter((r) => (r['Arrival Day'] || '').includes(day));
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-cyan">Arrivals</h1>
        <p className="page-subtitle">Who's rolling in and when — Party Palace {year}</p>
      </div>

      <PickleCatGreeting />

      <div className="arrivals-timeline">
        {DAY_ORDER.map((day) => {
          const people = byDay[day];
          if (!people.length) return null;
          return (
            <div key={day} className="timeline-day">
              <div className="timeline-day-label" style={{ color: DAY_COLORS[day] }}>
                <span className="day-name">{day}</span>
                <span className="day-count">{people.length} arriving</span>
              </div>
              <div className="timeline-bar" style={{ '--day-color': DAY_COLORS[day] }} />
              <div className="timeline-cards">
                {people
                  .sort((a, b) => (a['Arrival Time'] || '').localeCompare(b['Arrival Time'] || ''))
                  .map((person, i) => (
                    <ArrivalCard key={i} person={person} color={DAY_COLORS[day]} />
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <hr className="neon-divider" />

      <section>
        <h2 className="section-title neon-purple">Full List</h2>
        <div className="arrivals-table-wrap">
          <table className="arrivals-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Arrives</th>
                <th>Time</th>
                <th>Departs</th>
                <th>Spot</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr key={i}>
                  <td className="name-cell">{r['Name'] || '—'}</td>
                  <td style={{ color: DAY_COLORS[r['Arrival Day']] || 'inherit' }}>{r['Arrival Day'] || '—'}</td>
                  <td>{r['Arrival Time'] || '—'}</td>
                  <td>{r['Departure Day'] || '—'}</td>
                  <td>{r['Spot'] || '—'}</td>
                  <td className="notes-cell">{r['Notes'] || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ArrivalCard({ person, color }) {
  return (
    <div className="arrival-card neon-card" style={{ '--accent': color }}>
      <div className="arrival-name">{person['Name'] || 'Unknown'}</div>
      <div className="arrival-meta">
        {person['Arrival Time'] && (
          <span className="arrival-time">{person['Arrival Time']}</span>
        )}
        {person['Spot'] && (
          <span className="arrival-spot badge badge-purple">{person['Spot']}</span>
        )}
      </div>
      {person['Departure Day'] && (
        <div className="arrival-depart">↩ Departs {person['Departure Day']}</div>
      )}
      {person['Notes'] && (
        <div className="arrival-notes">{person['Notes']}</div>
      )}
    </div>
  );
}
