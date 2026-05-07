import { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import { useIdentity } from '../context/IdentityContext';
import './ProfileBadge.css';

export default function ProfileBadge() {
  const { identity, setIdentity } = useIdentity();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  if (!identity) return null;

  return (
    <div className="pb-wrap" ref={ref}>
      <button className="pb-btn" onClick={() => setOpen(o => !o)} aria-label="Your profile">
        <Avatar photo={identity.photo} name={identity.displayName} size="sm" />
        <span className="pb-name">{identity.displayName}</span>
      </button>

      {open && (
        <div className="pb-menu">
          <div className="pb-menu-user">
            <Avatar photo={identity.photo} name={identity.displayName} size="md" />
            <div>
              <div className="pb-menu-display">{identity.displayName}</div>
              {identity.sheetName && (
                <div className="pb-menu-sheet">on crew list as: {identity.sheetName}</div>
              )}
            </div>
          </div>
          <button
            className="pb-menu-action"
            onClick={() => { setIdentity(null); setOpen(false); }}>
            ↩ Switch identity
          </button>
        </div>
      )}
    </div>
  );
}
