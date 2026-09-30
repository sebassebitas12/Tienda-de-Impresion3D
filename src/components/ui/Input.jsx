import { useId } from 'react';
import './ui.css';

export function Input({ id: suppliedId, as: Tag = 'input', label, hint, error, className = '', 'aria-describedby': describedBy, ...props }) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const description = [describedBy, hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ') || undefined;
  return (
    <div className="v-field">
      <label htmlFor={id}>{label}</label>
      <Tag {...props} id={id} className={'v-input ' + className} aria-invalid={Boolean(error)} aria-describedby={description} />
      {hint && <small id={id + '-hint'}>{hint}</small>}
      {error && <p className="v-field-error" id={id + '-error'} role="alert">{error}</p>}
    </div>
  );
}
