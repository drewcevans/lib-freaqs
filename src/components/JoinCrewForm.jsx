import { useState, useRef } from 'react';
import { post } from '../config/webhook';
import { useIdentity } from '../context/IdentityContext';
import { uploadToCloudinary } from '../utils/cloudinary';
import Avatar from './Avatar';
import './JoinCrewForm.css';

const ARRIVAL_DAYS   = ['Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DEPARTURE_DAYS = ['Saturday', 'Sunday', 'Monday'];
const SLEEP_OPTIONS  = ['Tent', 'Car', 'Open Air', 'RV/Van', 'Wherever the vibe takes me'];

const INIT = {
  name: '', arrivalDay: '', arrivalTime: '', departureDay: '',
  buildCrew: null, bringingCar: null, carDetails: '',
  sleepingSituation: '', dietary: '', emergencyContact: '',
  set1: '', set2: '', set3: '',
  meltSongTitle: '', meltSongArtist: '',
  anythingElse: '',
};

export function rowToForm(row) {
  if (!row) return {};
  const c = (...keys) => { for (const k of keys) { const v = (row[k] || '').trim(); if (v) return v; } return ''; };
  const b = (...keys) => { const v = c(...keys).toLowerCase(); return v === 'yes' ? true : v === 'no' ? false : null; };
  return {
    name:              c('Name', 'name'),
    arrivalDay:        c('Arrival Day', 'arrivalDay'),
    arrivalTime:       c('Arrival Time', 'arrivalTime'),
    departureDay:      c('Departure Day', 'departureDay'),
    buildCrew:         b('Builder', 'buildCrew'),
    bringingCar:       b('Car Placement', 'Bringing Car', 'bringingCar'),
    carDetails:        c('Car Make/Model', 'Car Info', 'carDetails'),
    sleepingSituation: c('Where will you sleep?', 'Sleeping Situation', 'sleepingSituation'),
    dietary:           c('Dietary needs or restrictions', 'Dietary', 'dietaryNeeds', 'dietary'),
    emergencyContact:  c('Emergency contact', 'Emergency Contact', 'emergencyContact'),
    set1:              c('Set 1', 'set1'),
    set2:              c('Set 2', 'set2'),
    set3:              c('Set 3', 'set3'),
    meltSongTitle:     c('Melt Song Title', 'meltSongTitle'),
    meltSongArtist:    c('Melt Song Artist', 'meltSongArtist'),
    anythingElse:      c('Anything else to know about you?', 'Anything Else', 'anythingElse'),
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label className="jcf-label">
      {children}
      {required && <span className="jcf-required" aria-hidden="true">*</span>}
    </label>
  );
}

function FieldWrap({ children, error, highlight }) {
  return (
    <div className={`jcf-field-wrap ${highlight ? 'jcf-field-wrap--pink' : ''} ${error ? 'jcf-field-wrap--error' : ''}`}>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div className="jcf-toggle">
      <button type="button"
        className={`jcf-toggle-btn ${value === false ? 'active active--no' : ''}`}
        onClick={() => onChange(value === false ? null : false)}>
        No
      </button>
      <button type="button"
        className={`jcf-toggle-btn ${value === true ? 'active active--yes' : ''}`}
        onClick={() => onChange(value === true ? null : true)}>
        Yes
      </button>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function JoinCrewForm({ onClose, prefill, mode = 'join' }) {
  const { identity, setIdentity } = useIdentity();
  const [form, setForm]           = useState(prefill ? { ...INIT, ...prefill } : INIT);
  const [status, setStatus]       = useState('idle');
  const [errors, setErrors]       = useState({});

  // Update-mode profile fields (display name + photo)
  const [editDisplayName, setEditDisplayName] = useState(identity?.displayName || '');
  const [photoFile, setPhotoFile]             = useState(null);
  const [photoPreview, setPhotoPreview]       = useState(identity?.photo || null);
  const [dropping, setDropping]               = useState(false);
  const fileRef = useRef();

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: false }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.arrivalDay)  e.arrivalDay = true;
    return e;
  };

  const handlePhotoFile = (file) => {
    if (!file?.type.startsWith('image/')) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setStatus('loading');

    // Upload new photo to Cloudinary if a file was selected
    let photoUrl = mode === 'update' ? (photoPreview || identity?.photo || '') : (identity?.photo || '');
    if (photoFile) {
      try { photoUrl = await uploadToCloudinary(photoFile); }
      catch { /* keep existing */ }
    }

    // Update identity with any changed display name or photo
    if (mode === 'update' && identity) {
      setIdentity({
        ...identity,
        displayName: editDisplayName.trim() || identity.displayName,
        photo: photoUrl || identity.photo || null,
      });
    }

    const resolvedDisplayName = mode === 'update'
      ? (editDisplayName.trim() || identity?.displayName || '')
      : (identity?.displayName || '');

    const payload = {
      action:            mode === 'update' ? 'updateCrew' : 'joinCrew',
      name:              form.name.trim(),
      displayName:       resolvedDisplayName,
      photoUrl:          photoUrl || '',
      arrivalDay:        form.arrivalDay,
      arrivalTime:       form.arrivalTime,
      departureDay:      form.departureDay,
      builder:           form.buildCrew === true ? 'Yes' : form.buildCrew === false ? 'No' : '',
      carPlacement:      form.bringingCar === true ? 'Yes' : form.bringingCar === false ? 'No' : '',
      carMakeModel:      form.bringingCar === true ? form.carDetails.trim() : '',
      sleepingSituation: form.sleepingSituation,
      dietaryNeeds:      form.dietary.trim(),
      emergencyContact:  form.emergencyContact.trim(),
      set1:              form.set1.trim(),
      set2:              form.set2.trim(),
      set3:              form.set3.trim(),
      meltSongTitle:     form.meltSongTitle.trim(),
      meltSongArtist:    form.meltSongArtist.trim(),
      anythingElse:      form.anythingElse.trim(),
    };
    console.log('JoinCrewForm payload:', payload);
    post(payload);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStatus('success');
    }, 900);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (status === 'success') {
    const isUpdate = mode === 'update';
    return (
      <div className="jcf-success">
        <div className="jcf-success-glow" />
        <div className="jcf-success-icon">{isUpdate ? '✨' : '🎪'}</div>
        <h3 className="jcf-success-headline">
          {isUpdate ? 'Vibe updated!' : "You're in the crew!"}
        </h3>
        <p className="jcf-success-sub">
          {isUpdate ? 'Your info will update on the Freaqs page shortly.' : 'See you at the Palace 🏰'}
        </p>
        {!isUpdate && (
          <p className="jcf-success-note">
            Your info will show up on the Freaqs page once the sheet syncs. Give it a minute, then refresh.
          </p>
        )}
        <button className="jcf-done-btn" onClick={onClose}>
          {isUpdate ? 'Back to the crew ⚡' : "Let's go ⚡"}
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <form className="jcf-form" onSubmit={handleSubmit} noValidate>

      {/* Profile section — update mode only */}
      {mode === 'update' && (
        <div className="jcf-profile-section jcf-field--full">
          <div className="jcf-profile-photo-row">
            {/* Photo upload */}
            <div
              className={`jcf-photo-zone ${dropping ? 'jcf-dropping' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDropping(true); }}
              onDragLeave={() => setDropping(false)}
              onDrop={e => { e.preventDefault(); setDropping(false); handlePhotoFile(e.dataTransfer.files?.[0]); }}
              role="button"
              aria-label="Upload photo"
            >
              {photoPreview ? (
                <div className="jcf-photo-preview">
                  <Avatar photo={photoPreview} name={editDisplayName || identity?.displayName} size="lg" />
                  <span className="jcf-photo-change">tap to change</span>
                </div>
              ) : (
                <div className="jcf-photo-placeholder">
                  <span>📷</span>
                  <span className="jcf-photo-hint">Upload photo</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handlePhotoFile(e.target.files?.[0])} />

            {/* Display name */}
            <div className="jcf-field jcf-profile-name-field">
              <Label>Display Name</Label>
              <FieldWrap>
                <input className="jcf-input" type="text"
                  placeholder="How you appear to the crew"
                  value={editDisplayName}
                  onChange={e => setEditDisplayName(e.target.value)}
                  maxLength={40} />
              </FieldWrap>
              <span className="jcf-hint-text">Nickname, vibe, whatever you go by</span>
            </div>
          </div>
        </div>
      )}

      {/* Name — full width */}
      <div className="jcf-field jcf-field--full">
        <Label required>Name</Label>
        <FieldWrap error={errors.name}>
          <input className="jcf-input" type="text"
            placeholder="Name or whatever you want to be called"
            value={form.name} onChange={e => set('name', e.target.value)} />
        </FieldWrap>
        {errors.name && <span className="jcf-error-msg">Name is required</span>}
      </div>

      {/* Arrival Day + Time */}
      <div className="jcf-grid-2 jcf-field--full">
        <div className="jcf-field">
          <Label required>Arrival Day</Label>
          <FieldWrap error={errors.arrivalDay}>
            <div className="jcf-select-wrap">
              <select className="jcf-select" value={form.arrivalDay}
                onChange={e => set('arrivalDay', e.target.value)}>
                <option value="">Pick a day…</option>
                {ARRIVAL_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </FieldWrap>
          {errors.arrivalDay && <span className="jcf-error-msg">Required</span>}
        </div>

        <div className="jcf-field">
          <Label>Arrival Time</Label>
          <FieldWrap>
            <input className="jcf-input jcf-time" type="time"
              value={form.arrivalTime} onChange={e => set('arrivalTime', e.target.value)} />
          </FieldWrap>
        </div>
      </div>

      {/* Departure Day */}
      <div className="jcf-field">
        <Label>Departure Day</Label>
        <FieldWrap>
          <div className="jcf-select-wrap">
            <select className="jcf-select" value={form.departureDay}
              onChange={e => set('departureDay', e.target.value)}>
              <option value="">Pick a day…</option>
              {DEPARTURE_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </FieldWrap>
      </div>

      {/* Build crew */}
      <div className="jcf-field jcf-toggle-field">
        <Label>Part of the build crew?</Label>
        <Toggle value={form.buildCrew} onChange={v => set('buildCrew', v)} />
      </div>

      {/* Bringing a car + conditional details */}
      <div className="jcf-car-group jcf-field--full">
        <div className="jcf-field jcf-toggle-field">
          <Label>Bringing a car to camp?</Label>
          <Toggle value={form.bringingCar} onChange={v => set('bringingCar', v)} />
        </div>
        {form.bringingCar === true && (
          <div className="jcf-field jcf-field--indented" style={{ marginTop: 10 }}>
            <Label>Car Make &amp; Model</Label>
            <FieldWrap highlight>
              <input className="jcf-input" type="text" placeholder="e.g. Toyota Tacoma, gray"
                value={form.carDetails} onChange={e => set('carDetails', e.target.value)} />
            </FieldWrap>
          </div>
        )}
      </div>

      {/* Sleeping situation */}
      <div className="jcf-field jcf-field--full">
        <Label>Where will you sleep?</Label>
        <div className="jcf-sleep-group">
          {SLEEP_OPTIONS.map(opt => (
            <button key={opt} type="button"
              className={`jcf-sleep-btn ${form.sleepingSituation === opt ? 'active' : ''}`}
              onClick={() => set('sleepingSituation', form.sleepingSituation === opt ? '' : opt)}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary */}
      <div className="jcf-field">
        <Label>Dietary needs or restrictions</Label>
        <FieldWrap>
          <input className="jcf-input" type="text" placeholder="Vegan, gluten-free, allergic to vibes…"
            value={form.dietary} onChange={e => set('dietary', e.target.value)} />
        </FieldWrap>
      </div>

      {/* Emergency contact */}
      <div className="jcf-field">
        <Label>Emergency contact</Label>
        <FieldWrap>
          <input className="jcf-input" type="text" placeholder="Name & phone number"
            value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} />
        </FieldWrap>
      </div>

      {/* Top 3 sets */}
      <div className="jcf-field jcf-field--full">
        <Label>Top 3 sets you're most excited to see ⚡</Label>
        <div className="jcf-sets-group">
          {[['set1', 'Set #1'], ['set2', 'Set #2'], ['set3', 'Set #3']].map(([key, placeholder]) => (
            <FieldWrap key={key}>
              <input className="jcf-input" type="text" placeholder={placeholder}
                value={form[key]} onChange={e => set(key, e.target.value)} />
            </FieldWrap>
          ))}
        </div>
      </div>

      {/* Face-melting song */}
      <div className="jcf-field jcf-field--full">
        <Label>What one song will melt your face off? 🔥</Label>
        <div className="jcf-grid-2">
          <FieldWrap>
            <input className="jcf-input" type="text" placeholder="Song title"
              value={form.meltSongTitle} onChange={e => set('meltSongTitle', e.target.value)} />
          </FieldWrap>
          <FieldWrap>
            <input className="jcf-input" type="text" placeholder="Artist"
              value={form.meltSongArtist} onChange={e => set('meltSongArtist', e.target.value)} />
          </FieldWrap>
        </div>
      </div>

      {/* Anything else */}
      <div className="jcf-field jcf-field--full">
        <Label>Anything else to know about you?</Label>
        <FieldWrap>
          <textarea className="jcf-textarea" rows={3}
            placeholder="Weird talents, requests, hype, whatever…"
            value={form.anythingElse} onChange={e => set('anythingElse', e.target.value)} />
        </FieldWrap>
      </div>

      {/* Submit */}
      <button type="submit" className="jcf-submit-btn" disabled={status === 'loading'}>
        {status === 'loading'
          ? <><span className="jcf-spinner" /> Sending…</>
          : mode === 'update' ? 'Update my vibe ✨' : 'Join the Crew 🎪'}
      </button>

      <p className="jcf-required-note"><span className="jcf-required">*</span> required</p>
    </form>
  );
}
