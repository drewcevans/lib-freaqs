import { NavLink } from 'react-router-dom';
import YearSelector from './YearSelector';
import ProfileBadge from '../ProfileBadge';
import './NavBar.css';

const NAV_ITEMS = [
  { to: '/',         label: 'Freaqs',        icon: '💃' },
  { to: '/agenda',   label: 'Agenda',        icon: '📅' },
  { to: '/bring',    label: 'What To Bring', icon: '🧳' },
  { to: '/food',     label: 'Food & Drank',  icon: '🍺' },
  { to: '/builders', label: 'Builders',      icon: '🎨' },
  { to: '/map',      label: 'Camp Map',      icon: '🗺️' },
  { to: '/sets',     label: 'Set List',      icon: '⚡' },
  { to: '/shh',      label: 'Shhh',          icon: '👀' },
];

export default function NavBar({ year, onYearChange }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-logo">⚡</span>
          <div className="brand-text">
            <span className="brand-name neon-purple">LiB Freaqs</span>
            <span className="brand-sub">Party Palace</span>
          </div>
        </div>

        <nav className="navbar-nav" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="navbar-right">
          <YearSelector year={year} onChange={onYearChange} />
          <ProfileBadge />
        </div>
      </div>
    </header>
  );
}
