import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './Schedule.css';

// Expected columns: Day, Time, Activity, Location, Who, Duration, Notes

export default function Schedule({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.schedule);
  const [activeDay, setActiveDay] = useState(null);

  if (loading) return <LoadingState label="Loading schedule..." />;
  if (error) return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="📅" title="Schedule TBD." hint="Add data to the Schedule tab in your Google Sheet." />
  );

  const days = [...new Set(data.map((r) => r['Day']).filter(Boolean))];
  const selectedDay = activeDay || days[0];
  const events = data
    .filter((r) => r['Day'] === selectedDay)
    .sort((a, b) => (a['Time'] || '').localeCompare(b['Time'] || ''));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-pink">Schedule</h1>
        <p className="page-subtitle">Camp activities & itinerary — {year}</p>
      </div>

      <div className="day-tabs">
        {days.map((day) => (
          <button
            key={day}
            className={`day-tab sched-tab ${day === selectedDay ? 'active' : ''}`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="schedule-list">
        {events.map((event, i) => (
          <ScheduleEvent key={i} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}

function ScheduleEvent({ event, index }) {
  const colors = ['var(--neon-purple)', 'var(--neon-pink)', 'var(--neon-cyan)', 'var(--neon-green)', 'var(--neon-yellow)'];
  const color = colors[index % colors.length];

  return (
    <div className="sched-event neon-card" style={{ '--event-color': color }}>
      <div className="sched-time-col">
        <span className="sched-time" style={{ color }}>{event['Time'] || '?'}</span>
        {event['Duration'] && <span className="sched-duration">{event['Duration']}</span>}
      </div>
      <div className="sched-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      <div className="sched-content">
        <div className="sched-activity">{event['Activity'] || '—'}</div>
        <div className="sched-meta">
          {event['Location'] && (
            <span className="sched-location">📍 {event['Location']}</span>
          )}
          {event['Who'] && (
            <span className="sched-who">👤 {event['Who']}</span>
          )}
        </div>
        {event['Notes'] && <div className="sched-notes">{event['Notes']}</div>}
      </div>
    </div>
  );
}
