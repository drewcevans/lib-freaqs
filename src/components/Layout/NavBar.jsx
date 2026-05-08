import { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import ProfileBadge from '../ProfileBadge';
import NavDrawer from '../NavDrawer';
import './NavBar.css';

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

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
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
            <ProfileBadge />
            <button
              className="navbar-drawer-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
            >
              <span className="nb-bolt" aria-hidden="true">⚡</span>
            </button>
          </div>
        </div>
      </header>

      <NavDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
