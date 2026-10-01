import { selectedValues } from '../../utils/facetFilters.js';
import './filter-chips.css';

export function FilterChips({ label, options, selected, onToggle, className = '' }) {
  const values = selectedValues(selected);
  return <div className={`v-filter-chips ${className}`} role="group" aria-label={label}>
    {options.map(option => {
      const active = option.value === 'all' ? !values.length : values.includes(option.value);
      return <button className="admin-orders__filter" type="button" key={option.value} aria-pressed={active} onClick={() => onToggle(option.value)}>
        <span className="v-filter-check" aria-hidden="true">{active ? '✓' : '+'}</span><span>{option.label}</span>
        {option.count != null && <strong>{option.count}</strong>}
      </button>;
    })}
  </div>;
}
