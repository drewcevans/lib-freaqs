import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SHEET_TABS } from '../config/sheets';
import { FORMS } from '../config/forms';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './WhatToBring.css';

// Expected columns: Item, Category, Who's Bringing, Status (confirmed/needed/maybe), Notes

const STATUS_BADGE = {
  confirmed: 'badge-green',
  needed:    'badge-pink',
  maybe:     'badge-yellow',
};

function openForm(url) {
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

export default function WhatToBring({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.whatToBring);
  const [checked, setChecked] = useLocalStorage(`lib-checked-${year}`, {});
  const [activeCategory, setActiveCategory] = useState('All');

  if (loading) return <LoadingState label="Loading the list..." />;
  if (error)   return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="🧳" title="Nothing on the list yet."
      hint="Add items via the Google Sheet or the 'Add Item' button." />
  );

  const categories = ['All', ...new Set(data.map((r) => r['Category']).filter(Boolean))];
  const filtered = activeCategory === 'All' ? data : data.filter((r) => r['Category'] === activeCategory);

  const toggle = (item) => {
    setChecked({ ...checked, [item]: !checked[item] });
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const confirmed = data.filter((r) => /confirmed/i.test(r['Status'] || '')).length;
  const needed = data.filter((r) => /needed/i.test(r['Status'] || '')).length;

  return (
    <div className="page-container">
      <div className="wtb-header">
        <div>
          <h1 className="page-title neon-green">What To Bring 🧳</h1>
          <p className="page-subtitle">Group gear list — Party Palace {year}</p>
        </div>
        <button
          className="neon-btn wtb-add-btn"
          style={{ color: 'var(--neon-green)', borderColor: 'var(--neon-green)' }}
          onClick={() => openForm(FORMS.addPackingItem)}
          disabled={!FORMS.addPackingItem}
          title={!FORMS.addPackingItem ? 'Form URL not yet configured' : 'Add an item'}
        >
          + Add Item
        </button>
      </div>

      <div className="wtb-stats">
        <span className="wtb-stat"><span className="neon-green">{confirmed}</span> Confirmed</span>
        <span className="wtb-sep">·</span>
        <span className="wtb-stat"><span className="neon-pink">{needed}</span> Still Needed</span>
        <span className="wtb-sep">·</span>
        <span className="wtb-stat"><span className="neon-cyan">{checkedCount}</span> Checked Off</span>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button key={cat}
            className={`cat-filter ${cat === activeCategory ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >{cat}</button>
        ))}
      </div>

      <div className="wtb-list">
        {filtered.map((item, i) => {
          const key = item['Item'] || `item-${i}`;
          const done = !!checked[key];
          const status = (item['Status'] || 'needed').toLowerCase();
          return (
            <label key={i} className={`wtb-row ${done ? 'wtb-row--done' : ''}`}>
              <input
                type="checkbox"
                className="wtb-checkbox"
                checked={done}
                onChange={() => toggle(key)}
              />
              <div className="wtb-row-inner">
                <span className="wtb-item-name">{item['Item'] || '—'}</span>
                <div className="wtb-row-meta">
                  {item['Category'] && (
                    <span className="wtb-category">{item['Category']}</span>
                  )}
                  <span className={`badge ${STATUS_BADGE[status] || 'badge-cyan'}`}>{status}</span>
                  {item["Who's Bringing"] && (
                    <span className="wtb-who">→ {item["Who's Bringing"]}</span>
                  )}
                </div>
                {item['Notes'] && <p className="wtb-notes">{item['Notes']}</p>}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
