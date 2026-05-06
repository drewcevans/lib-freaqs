import { YEARS } from '../../config/sheets';
import './YearSelector.css';

export default function YearSelector({ year, onChange }) {
  return (
    <div className="year-selector">
      <span className="year-label">Year</span>
      <div className="year-pills">
        {YEARS.map((y) => (
          <button
            key={y}
            className={`year-pill ${y === year ? 'active' : ''}`}
            onClick={() => onChange(y)}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}
