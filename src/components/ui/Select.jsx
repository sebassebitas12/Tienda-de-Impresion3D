import { useId } from 'react';
import './ui.css';

export function Select({ id: suppliedId, label, options = [], placeholder, error, hint, className = '', 'aria-describedby': describedBy, ...props }) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const description = [describedBy, hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ') || undefined;
  return (
    <div className="v-field">
      <label htmlFor={id}>{label}</label>
      <select {...props} id={id} className={'v-input ' + className} aria-invalid={Boolean(error)} aria-describedby={description}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      </select>
      {hint && <small id={id + '-hint'}>{hint}</small>}
      {error && <p id={id + '-error'} className="v-field-error" role="alert">{error}</p>}
    </div>
  );
}
