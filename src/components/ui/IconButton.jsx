import './ui.css';

export function IconButton({ label, variant = 'square', children, className = '', type = 'button', ...props }) {
  return (
    <button {...props} type={type} className={'v-icon-button v-icon-button--' + variant + ' ' + className} aria-label={label}>
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
