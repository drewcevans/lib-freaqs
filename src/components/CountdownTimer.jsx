import { useState, useEffect, Fragment } from 'react';
import './CountdownTimer.css';

const TARGET = new Date('2026-05-20T12:00:00');

function getTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  };
}

const UNITS = [
  { key: 'days',    label: 'days', cls: 'neon-purple' },
  { key: 'hours',   label: 'hrs',  cls: 'neon-cyan'   },
  { key: 'minutes', label: 'min',  cls: 'neon-pink'   },
  { key: 'seconds', label: 'sec',  cls: 'neon-yellow' },
];

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <div className="cdt-wrap">
        <span className="cdt-arrived">🏰⚡ The Palace has risen! ⚡🏰</span>
      </div>
    );
  }

  return (
    <div className="cdt-wrap">
      <div className="cdt-digits">
        {UNITS.map(({ key, label, cls }, i) => (
          <Fragment key={key}>
            <div className="cdt-unit">
              <span className={`cdt-num ${cls}`}>{String(time[key]).padStart(2, '0')}</span>
              <span className="cdt-unit-label">{label}</span>
            </div>
            {i < 3 && <span className="cdt-sep" aria-hidden="true">:</span>}
          </Fragment>
        ))}
      </div>
      <div className="cdt-label">until we get back to work 🏕️⚡</div>
    </div>
  );
}
