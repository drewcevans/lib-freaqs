import { NavLink } from 'react-router-dom';
import YearSelector from './YearSelector';
import './NavBar.css';

const NAV_ITEMS = [
  { to: '/',           label: 'Arrivals',    icon: '🏕️' },
  { to: '/packing',   label: 'Packing',     icon: '🎒' },
  { to: '/meals',     label: 'Meals',       icon: '🍕' },
  { to: '/schedule',  label: 'Schedule',    icon: '📅' },
  { to: '/build',     label: 'Build Crew',  icon: '🔧' },
  { to: '/sets',      label: 'Sets',        icon: '🎵' },
  { to: '/secrets',   label: 'Secret Sets', icon: '🔮' },
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
        </div>
      </div>
    </header>
  );
}
