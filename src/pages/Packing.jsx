import { useState } from 'react';
import { useSheetData } from '../hooks/useSheetData';
import { SHEET_TABS } from '../config/sheets';
import { LoadingState, EmptyState, ErrorState } from '../components/DataState';
import './Packing.css';

// Expected columns: Item, Category, Who's Bringing, Status (confirmed/needed/maybe), Notes
const STATUS_COLORS = {
  confirmed: 'badge-green',
  needed:    'badge-pink',
  maybe:     'badge-yellow',
};

export default function Packing({ year }) {
  const { data, loading, error } = useSheetData(year, SHEET_TABS.packing);
  const [activeCategory, setActiveCategory] = useState('All');

  if (loading) return <LoadingState label="Loading packing list..." />;
  if (error) return <ErrorState message={error} />;
  if (!data.length) return (
    <EmptyState icon="🎒" title="No packing data yet." hint="Add data to the Packing tab in your Google Sheet." />
  );

  const categories = ['All', ...new Set(data.map((r) => r['Category']).filter(Boolean))];
  const filtered = activeCategory === 'All'
    ? data
    : data.filter((r) => r['Category'] === activeCategory);

  const confirmed = data.filter((r) => (r['Status'] || '').toLowerCase() === 'confirmed').length;
  const needed = data.filter((r) => (r['Status'] || '').toLowerCase() === 'needed').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title neon-green">Packing List</h1>
        <p className="page-subtitle">Party Palace group gear — {year}</p>
      </div>

      <div className="packing-stats">
        <div className="stat-card neon-card">
          <span className="stat-number neon-green">{confirmed}</span>
          <span className="stat-label">Confirmed</span>
        </div>
        <div className="stat-card neon-card">
          <span className="stat-number neon-pink">{needed}</span>
          <span className="stat-label">Still Needed</span>
        </div>
        <div className="stat-card neon-card">
          <span className="stat-number neon-cyan">{data.length}</span>
          <span className="stat-label">Total Items</span>
        </div>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cat-filter ${cat === activeCategory ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="packing-grid">
        {filtered.map((item, i) => {
          const status = (item['Status'] || 'needed').toLowerCase();
          return (
            <div key={i} className="pack-item neon-card">
              <div className="pack-item-top">
                <span className="pack-item-name">{item['Item'] || '—'}</span>
                <span className={`badge ${STATUS_COLORS[status] || 'badge-cyan'}`}>{status}</span>
              </div>
              {item['Category'] && (
                <span className="pack-category">{item['Category']}</span>
              )}
              {item["Who's Bringing"] && (
                <div className="pack-who">
                  <span className="pack-who-label">Bringing:</span>
                  <span className="pack-who-name neon-cyan">{item["Who's Bringing"]}</span>
                </div>
              )}
              {item['Notes'] && (
                <div className="pack-notes">{item['Notes']}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
