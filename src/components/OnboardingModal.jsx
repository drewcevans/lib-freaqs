import { useState, useRef, Fragment } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { useIdentity } from '../context/IdentityContext';
import { uploadToCloudinary } from '../utils/cloudinary';
import Avatar from './Avatar';
import './OnboardingModal.css';

export default function OnboardingModal({ year }) {
  const { setIdentity } = useIdentity();
  const { data: freaqData, loading } = useSheetData(year, SHEET_TABS.freaqs);

  const [step,        setStep]        = useState(1);
  const [sheetName,   setSheetName]   = useState('');
  const [picked,      setPicked]      = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [photoFile,   setPhotoFile]   = useState(null);
  const [photoPreview,setPhotoPreview]= useState(null);
  const [dropping,    setDropping]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const fileRef = useRef();

  const names = freaqData.map(r => r['Name']).filter(Boolean);

  const handleNameSelect = (v) => {
    setSheetName(v);
    setPicked(true);
    if (v && v !== '__new__') {
      setDisplayName(prev => (!prev || prev === sheetName) ? v : prev);
    }
  };

  const handlePhotoFile = (file) => {
    if (!file?.type.startsWith('image/')) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropping(false);
    handlePhotoFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let photoUrl = null;
    if (photoFile) {
      try { photoUrl = await uploadToCloudinary(photoFile); }
      catch { /* continue without photo */ }
    }
    const finalSheet = sheetName === '__new__' ? '' : sheetName;
    const finalName  = displayName.trim() || finalSheet || 'Palace Freaq';
    setIdentity({ sheetName: finalSheet, displayName: finalName, photo: photoUrl });
  };

  return (
    <div className="ob-overlay">
      <div className="ob-panel">

        {/* Header */}
        <div className="ob-header">
          <div className="ob-logo" aria-hidden="true">⚡</div>
          <h1 className="ob-title">LiB Freaqs</h1>
          <p className="ob-welcome">Welcome to LiB Freaqs 🎪⚡</p>
          <p className="ob-sub">Party Palace awaits.</p>
        </div>

        {/* Step indicator */}
        <div className="ob-steps" aria-label="Step indicator">
          {[1, 2, 3].map((s, i) => (
            <Fragment key={s}>
              <div className={`ob-step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`}
                   aria-current={step === s ? 'step' : undefined}>
                {step > s ? '✓' : s}
              </div>
              {i < 2 && <div className={`ob-step-line ${step > s ? 'done' : ''}`} />}
            </Fragment>
          ))}
        </div>

        {/* ── Step 1: Identity ── */}
        {step === 1 && (
          <div className="ob-step-content">
            <div className="ob-field-label">Who are you?</div>
            {loading ? (
              <div className="ob-loading">Loading crew list…</div>
            ) : (
              <div className="ob-select-wrap">
                <select className="ob-select" value={sheetName}
                  onChange={e => handleNameSelect(e.target.value)}>
                  <option value="">Select your name…</option>
                  {names.map(n => <option key={n} value={n}>{n}</option>)}
                  <option disabled>─────────────</option>
                  <option value="__new__">✦ I'm new / not listed yet</option>
                </select>
              </div>
            )}
            <p className="ob-hint">
              {sheetName === '__new__'
                ? "You can still join the crew on the Freaqs page."
                : "Pick your name from the crew list."}
            </p>
            <button className="ob-next-btn" disabled={!picked}
              onClick={() => setStep(2)}>
              Next →
            </button>
          </div>
        )}

        {/* ── Step 2: Display name ── */}
        {step === 2 && (
          <div className="ob-step-content">
            <div className="ob-field-label">What should we call you?</div>
            <p className="ob-hint">Shown on your card and everywhere in the app. Nickname? Use it.</p>
            <input
              className="ob-input"
              type="text"
              placeholder="Your name or vibe…"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              autoFocus
              maxLength={40}
            />
            <div className="ob-nav-row">
              <button className="ob-back-btn" onClick={() => setStep(1)}>← Back</button>
              <button className="ob-next-btn" disabled={!displayName.trim()}
                onClick={() => setStep(3)}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Photo ── */}
        {step === 3 && (
          <div className="ob-step-content">
            <div className="ob-field-label">Drop a photo of yourself 📸</div>
            <p className="ob-hint">Optional but encouraged. Shows on your card and the crew timeline.</p>

            <div
              className={`ob-photo-zone ${dropping ? 'ob-dropping' : ''} ${photoPreview ? 'ob-has-photo' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDropping(true); }}
              onDragLeave={() => setDropping(false)}
              onDrop={handleDrop}
              role="button"
              aria-label="Upload photo"
            >
              {photoPreview ? (
                <div className="ob-photo-preview-wrap">
                  <Avatar photo={photoPreview} name={displayName} size="xl" />
                  <span className="ob-photo-change">Click to change</span>
                </div>
              ) : (
                <div className="ob-photo-placeholder">
                  <span className="ob-photo-icon">📷</span>
                  <span className="ob-photo-cta">Click or drag to upload</span>
                  <span className="ob-photo-sub">Camera or gallery on mobile</span>
                </div>
              )}
            </div>

            <input ref={fileRef} type="file" accept="image/*"
              className="ob-file-hidden"
              onChange={e => handlePhotoFile(e.target.files?.[0])} />

            {photoPreview && (
              <button className="ob-remove-photo" onClick={e => { e.stopPropagation(); setPhotoFile(null); setPhotoPreview(null); }}>
                Remove photo
              </button>
            )}

            <div className="ob-nav-row">
              <button className="ob-back-btn" onClick={() => setStep(2)}>← Back</button>
              <button className="ob-submit-btn" disabled={submitting} onClick={handleSubmit}>
                {submitting ? 'Uploading…' : "Let's go 🚀"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
