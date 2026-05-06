export function LoadingState({ label = 'Loading data...' }) {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
        {label}
      </span>
    </div>
  );
}

export function EmptyState({ icon = '📡', title, hint }) {
  return (
    <div className="empty-state">
      <div className="state-icon">{icon}</div>
      <p>{title}</p>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="empty-state">
      <div className="state-icon">⚠️</div>
      <p style={{ color: 'var(--neon-pink)' }}>{message}</p>
      <p className="hint">Check the sheet config in src/config/sheets.js</p>
    </div>
  );
}
