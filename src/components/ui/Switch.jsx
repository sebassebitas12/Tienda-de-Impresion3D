import './ui.css';

export function Switch({ checked = false, label, onChange, disabled = false, className = '', ...props }) {
  return (
    <button {...props} type="button" role="switch" aria-label={label} aria-checked={checked}
      disabled={disabled} className={'v-switch ' + className} onClick={() => onChange?.(!checked)}>
      <i aria-hidden="true" />
    </button>
  );
}
