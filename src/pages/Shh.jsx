import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './Shh.css';

// Expected columns: Artist, Day, Time, Stage, Confirmed (Confirmed/Rumored/Wishlist/TBD), Notes

const STATUS_META = {
  confirmed: { badge: 'badge-green',  icon: '✅', label: 'Confirmed',  order: 0 },
  rumored:   { badge: 'badge-yellow', icon: '🔮', label: 'Rumored',    order: 1 },
  wishlist:  { badge: 'badge-purple', icon: '💜', label: 'Wishlist',   order: 2 },
  tbd:       { badge: 'badge-cyan',   icon: '❓', label: 'TBD',        order: 3 },
};

function getStatus(val) {
  const v = (val || '').toLowerCase().trim();
  return STATUS_META[v] || { badge: 'badge-cyan', icon: '❓', label: val || '?', order: 99 };
}

export default function Shh({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.shh);

  if (loading) return <LoadingState label="Decoding the secrets..." />;
  if (error)   return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="👀" title="No secrets yet... or are there?"
      hint="Add data to the Shhh tab. Admin eyes only." />
  );

  // Group by status, sorted by order
  const groups = Object.entries(
    data.reduce((acc, row) => {
      const statusKey = (row['Confirmed'] || 'tbd').toLowerCase().trim();
      if (!acc[statusKey]) acc[statusKey] = [];
      acc[statusKey].push(row);
      return acc;
    }, {})
  ).sort(([a], [b]) => (getStatus(a).order ?? 99) - (getStatus(b).order ?? 99));

  const total = data.length;
  const confirmed = data.filter(r => /^confirmed$/i.test(r['Confirmed'] || '')).length;
  const rumored   = data.filter(r => /^rumored$/i.test(r['Confirmed'] || '')).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title shh-title">Shhh 👀</h1>
        <p className="page-subtitle">Secret set intelligence — {year} 🤫</p>
      </div>

      <div className="shh-hero neon-card">
        <div className="shh-hero-left">
          <span className="shh-hero-icon">🔮</span>
          <div>
            <div className="shh-hero-name">The Intel Board</div>
            <div className="shh-hero-sub">Keep this between us. What happens at LiB stays at LiB.</div>
          </div>
        </div>
        <div className="shh-hero-counts">
          <div className="shh-count"><span className="neon-green">{confirmed}</span><span>Confirmed</span></div>
          <div className="shh-count"><span className="neon-yellow">{rumored}</span><span>Rumored</span></div>
          <div className="shh-count"><span className="neon-cyan">{total}</span><span>Total</span></div>
        </div>
      </div>

      {groups.map(([statusKey, sets]) => {
        const meta = getStatus(statusKey);
        const sortedSets = [...sets].sort((a, b) => {
          const dayA = a['Day'] || '';
          const dayB = b['Day'] || '';
          if (dayA !== dayB) return dayA.localeCompare(dayB);
          return (a['Time'] || '').localeCompare(b['Time'] || '');
        });

        return (
          <section key={statusKey} className="shh-group">
            <h2 className="shh-group-title">
              <span className="shh-group-icon">{meta.icon}</span>
              <span className={`badge ${meta.badge}`}>{meta.label}</span>
              <span className="shh-group-count">{sets.length}</span>
            </h2>

            <div className="shh-grid">
              {sortedSets.map((set, i) => (
                <ShhCard key={i} set={set} meta={meta} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="shh-admin-note">
        <span>🛡️</span>
        <span>Admin: update via the <strong>Shhh 👀</strong> tab in the Google Sheet.</span>
      </div>
    </div>
  );
}

function ShhCard({ set, meta }) {
  return (
    <div className="shh-card neon-card">
      <div className="shh-card-top">
        <div className="shh-artist">{set['Artist'] || '???'}</div>
        <span className={`badge ${meta.badge}`}>{meta.label}</span>
      </div>
      <div className="shh-details">
        {set['Day'] && <span className="shh-detail shh-day">{set['Day']}</span>}
        {set['Time'] && <span className="shh-detail neon-cyan">{set['Time']}</span>}
        {set['Stage'] && <span className="shh-detail">📍 {set['Stage']}</span>}
      </div>
      {set['Notes'] && <p className="shh-notes">{set['Notes']}</p>}
    </div>
  );
}
