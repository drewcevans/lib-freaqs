import { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import Modal from './Modal';
import JoinCrewForm, { rowToForm } from './JoinCrewForm';
import { useIdentity } from '../context/IdentityContext';
import { useSheetData } from '../hooks/useSheetData';
import { DEFAULT_YEAR, SHEET_TABS } from '../config/sheets';
import './ProfileBadge.css';

export default function ProfileBadge() {
  const { identity, setIdentity }     = useIdentity();
  const { data }                      = useSheetData(DEFAULT_YEAR, SHEET_TABS.freaqs);
  const [open, setOpen]               = useState(false);
  const [editOpen, setEditOpen]       = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  if (!identity) return null;

  const myRow = identity.sheetName
    ? data.find(r => {
        const name = (r['Name'] || '').trim() || (Object.values(r)[1] || '').trim();
        return name === identity.sheetName;
      }) ?? null
    : null;

  const openEdit = () => {
    setOpen(false);
    setEditOpen(true);
  };

  return (
    <>
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
            <button className="pb-menu-action pb-menu-action--primary" onClick={openEdit}>
              ✏️ Edit Profile
            </button>
            <button
              className="pb-menu-action pb-menu-action--signout"
              onClick={() => { setIdentity(null); setOpen(false); }}>
              ↩ Sign out
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}
             title="Edit Profile ✏️" panelClass="modal-panel--wide">
        <JoinCrewForm
          onClose={() => setEditOpen(false)}
          prefill={myRow ? rowToForm(myRow) : undefined}
          mode="update"
        />
      </Modal>
    </>
  );
}
