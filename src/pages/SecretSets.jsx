import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './SecretSets.css';

// Expected columns: Artist, Day, Time, Stage, Status (Rumored/Confirmed/Wishlist), Source, Notes

const STATUS_META = {
  Confirmed:  { badge: 'badge-green',  icon: '✅', label: 'Confirmed' },
  Rumored:    { badge: 'badge-yellow', icon: '🔮', label: 'Rumored' },
  Wishlist:   { badge: 'badge-purple', icon: '💜', label: 'Wishlist' },
};

export default function SecretSets({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.secretSets);

  if (loading) return <LoadingState label="Decoding the secrets..." />;
  if (error) return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState
      icon="🔮"
      title="No secret sets intel yet."
      hint="Add data to the Secret Sets tab. Admins only — keep it spicy."
    />
  );

  const confirmed = data.filter((r) => (r['Status'] || '').toLowerCase() === 'confirmed');
  const rumored = data.filter((r) => (r['Status'] || '').toLowerCase() === 'rumored');
  const wishlist = data.filter((r) => (r['Status'] || '').toLowerCase() === 'wishlist');

  const groups = [
    { key: 'Confirmed', items: confirmed },
    { key: 'Rumored',   items: rumored },
    { key: 'Wishlist',  items: wishlist },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" style={{
          background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink), var(--neon-cyan))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 12px var(--neon-purple))',
        }}>
          Secret Sets
        </h1>
        <p className="page-subtitle">Rumored, confirmed & wishlist — {year} 🤫</p>
      </div>

      <div className="secret-hero neon-card">
        <div className="secret-hero-text">
          <span className="secret-hero-icon">🔮</span>
          <div>
            <div className="secret-hero-title">The Intel Board</div>
            <div className="secret-hero-sub">Keep this quiet. What happens at LiB stays at LiB.</div>
          </div>
        </div>
        <div className="secret-counts">
          <div className="secret-count"><span className="neon-green">{confirmed.length}</span> Confirmed</div>
          <div className="secret-count"><span className="neon-yellow">{rumored.length}</span> Rumored</div>
          <div className="secret-count"><span className="neon-purple">{wishlist.length}</span> Wishlist</div>
        </div>
      </div>

      {groups.map(({ key, items }) => {
        const meta = STATUS_META[key] || { badge: 'badge-cyan', icon: '❓', label: key };
        return (
          <section key={key} className="secret-group">
            <h2 className="secret-group-title">
              <span className="secret-group-icon">{meta.icon}</span>
              <span className={`badge ${meta.badge}`}>{meta.label}</span>
            </h2>
            <div className="secret-grid">
              {items.map((set, i) => (
                <SecretCard key={i} set={set} meta={meta} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function SecretCard({ set, meta }) {
  return (
    <div className="secret-card neon-card">
      <div className="secret-card-top">
        <div className="secret-artist">{set['Artist'] || '???'}</div>
        <span className={`badge ${meta.badge}`}>{meta.label}</span>
      </div>
      <div className="secret-details">
        {set['Day'] && <span className="secret-detail">{set['Day']}</span>}
        {set['Time'] && <span className="secret-detail neon-cyan">{set['Time']}</span>}
        {set['Stage'] && <span className="secret-detail">{set['Stage']}</span>}
      </div>
      {set['Source'] && (
        <div className="secret-source">Source: <span style={{ color: 'var(--text-primary)' }}>{set['Source']}</span></div>
      )}
      {set['Notes'] && <div className="secret-notes">{set['Notes']}</div>}
    </div>
  );
}
