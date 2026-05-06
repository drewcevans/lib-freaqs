import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { FORMS } from '../config/forms';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './FoodAndDrank.css';

// Expected columns: Item, Section (Meals/Snacks/Drank), Day, Who's Bringing, Notes

const SECTIONS = [
  { key: 'Meals',  icon: '🍽️', color: 'var(--neon-yellow)', formKey: 'addMealItem' },
  { key: 'Snacks', icon: '🍕', color: 'var(--neon-green)',  formKey: 'addSnackItem' },
  { key: 'Drank',  icon: '🍺', color: 'var(--neon-cyan)',   formKey: 'addDrankItem' },
];

function openForm(url) {
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

export default function FoodAndDrank({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.foodAndDrank);

  if (loading) return <LoadingState label="Loading the spread..." />;
  if (error)   return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="🍺" title="Nothing on the menu yet."
      hint="Add items to the Food & Drank tab in your Google Sheet." />
  );

  const bySection = SECTIONS.reduce((acc, s) => {
    acc[s.key] = data.filter((r) =>
      (r['Section'] || '').toLowerCase() === s.key.toLowerCase()
    );
    return acc;
  }, {});

  // Days for the Meals tab
  const mealDays = [...new Set((bySection['Meals'] || []).map((r) => r['Day']).filter(Boolean))];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-yellow">Food & Drank 🍺</h1>
        <p className="page-subtitle">The Party Palace spread — {year}</p>
      </div>

      {SECTIONS.map((section) => {
        const items = bySection[section.key] || [];
        const formUrl = FORMS[section.formKey];

        return (
          <section key={section.key} className="fd-section">
            <div className="fd-section-header">
              <h2 className="fd-section-title" style={{ color: section.color }}>
                {section.icon} {section.key}
                <span className="fd-count">({items.length})</span>
              </h2>
              <button
                className="neon-btn fd-add-btn"
                style={{ color: section.color, borderColor: section.color }}
                onClick={() => openForm(formUrl)}
                disabled={!formUrl}
                title={!formUrl ? 'Form URL not yet configured' : `Add a ${section.key.toLowerCase()} item`}
              >
                + Add
              </button>
            </div>

            {items.length === 0 ? (
              <p className="fd-empty">Nothing here yet — add some!</p>
            ) : section.key === 'Meals' && mealDays.length > 0 ? (
              /* Meals grouped by day */
              <div className="fd-by-day">
                {mealDays.map((day) => {
                  const dayItems = items.filter((r) => r['Day'] === day);
                  return (
                    <div key={day} className="fd-day-group">
                      <div className="fd-day-label" style={{ color: section.color }}>{day}</div>
                      <div className="fd-items">
                        {dayItems.map((item, i) => (
                          <FoodItem key={i} item={item} color={section.color} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="fd-items">
                {items.map((item, i) => (
                  <FoodItem key={i} item={item} color={section.color} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function FoodItem({ item, color }) {
  return (
    <div className="fd-item neon-card" style={{ '--fd-color': color }}>
      <div className="fd-item-name">{item['Item'] || '—'}</div>
      <div className="fd-item-meta">
        {item['Day'] && <span className="fd-day-tag">{item['Day']}</span>}
        {item["Who's Bringing"] && (
          <span className="fd-who" style={{ color }}>→ {item["Who's Bringing"]}</span>
        )}
      </div>
      {item['Notes'] && <p className="fd-notes">{item['Notes']}</p>}
    </div>
  );
}
