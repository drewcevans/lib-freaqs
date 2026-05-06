import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './Meals.css';

// Expected columns: Day, Meal (Breakfast/Lunch/Dinner/Snacks), Description, Chef, Serves, Notes

const MEAL_COLORS = {
  Breakfast: { color: 'var(--neon-yellow)', icon: '🌅' },
  Lunch:     { color: 'var(--neon-green)',  icon: '☀️' },
  Dinner:    { color: 'var(--neon-purple)', icon: '🌙' },
  Snacks:    { color: 'var(--neon-pink)',   icon: '🍕' },
};

export default function Meals({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.meals);
  const [activeDay, setActiveDay] = useState(null);

  if (loading) return <LoadingState label="Loading meal plan..." />;
  if (error) return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="🍕" title="No meal data yet." hint="Add data to the Meals tab in your Google Sheet." />
  );

  const days = [...new Set(data.map((r) => r['Day']).filter(Boolean))];
  const selectedDay = activeDay || days[0];
  const meals = data.filter((r) => r['Day'] === selectedDay);

  const mealOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const grouped = mealOrder.reduce((acc, m) => {
    acc[m] = meals.filter((r) => (r['Meal'] || '').includes(m));
    return acc;
  }, {});

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-yellow">Meals</h1>
        <p className="page-subtitle">Who's cooking what — Party Palace {year}</p>
      </div>

      <div className="day-tabs">
        {days.map((day) => (
          <button
            key={day}
            className={`day-tab ${day === selectedDay ? 'active' : ''}`}
            onClick={() => setActiveDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="meal-columns">
        {mealOrder.map((mealType) => {
          const items = grouped[mealType];
          const meta = MEAL_COLORS[mealType] || { color: 'var(--neon-cyan)', icon: '🍽️' };
          if (!items.length) return null;
          return (
            <div key={mealType} className="meal-column">
              <h3 className="meal-type-header" style={{ color: meta.color }}>
                <span>{meta.icon}</span> {mealType}
              </h3>
              {items.map((meal, i) => (
                <div key={i} className="meal-card neon-card" style={{ '--meal-color': meta.color }}>
                  <div className="meal-desc">{meal['Description'] || '—'}</div>
                  {meal['Chef'] && (
                    <div className="meal-chef">
                      <span className="meal-chef-label">Chef:</span>
                      <span style={{ color: meta.color }}>{meal['Chef']}</span>
                    </div>
                  )}
                  {meal['Serves'] && (
                    <div className="meal-serves">Serves {meal['Serves']}</div>
                  )}
                  {meal['Notes'] && <div className="meal-notes">{meal['Notes']}</div>}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
