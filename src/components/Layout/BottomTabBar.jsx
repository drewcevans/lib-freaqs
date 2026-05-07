import { NavLink } from 'react-router-dom';
import './BottomTabBar.css';

const TABS = [
  { to: '/',         label: 'Freaqs', icon: '💃' },
  { to: '/agenda',   label: 'Agenda', icon: '📅' },
  { to: '/bring',    label: 'Bring',  icon: '🧳' },
  { to: '/food',     label: 'Food',   icon: '🍺' },
  { to: '/builders', label: 'Build',  icon: '🎨' },
  { to: '/map',      label: 'Map',    icon: '🗺️' },
  { to: '/sets',     label: 'Sets',   icon: '⚡' },
  { to: '/shh',      label: 'Shhh',  icon: '👀' },
];

export default function BottomTabBar() {
  return (
    <nav className="bottom-tab-bar" aria-label="Main navigation">
      {TABS.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bottom-tab${isActive ? ' active' : ''}`}
        >
          <span className="bottom-tab-icon" aria-hidden="true">{icon}</span>
          <span className="bottom-tab-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
