import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './NavDrawer.css';

const NAV_ITEMS = [
  { to: '/',         label: 'Freaqs',        icon: '💃' },
  { to: '/agenda',   label: 'Agenda',        icon: '📅' },
  { to: '/bring',    label: 'What To Bring', icon: '🧳' },
  { to: '/food',     label: 'Food & Drank',  icon: '🍺' },
  { to: '/builders', label: 'Builders',      icon: '🎨' },
  { to: '/map',      label: 'Camp Map',      icon: '🗺️' },
  { to: '/sets',     label: 'Set List',      icon: '🎵' },
  { to: '/shh',      label: 'Shhh',          icon: '👀' },
];

export default function NavDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`nd-backdrop ${open ? 'nd-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        className={`nd-drawer ${open ? 'nd-drawer--open' : ''}`}
        aria-label="Mobile navigation"
      >
        <button className="nd-close" onClick={onClose} aria-label="Close menu">✕</button>
        <div className="nd-items">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nd-item${isActive ? ' nd-item--active' : ''}`}
              onClick={onClose}
            >
              <span className="nd-item-icon" aria-hidden="true">{icon}</span>
              <span className="nd-item-label">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
