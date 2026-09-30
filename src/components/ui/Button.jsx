import './ui.css';

export function Button({
  as: Component = 'button',
  variant = 'primary',
  pill = false,
  fullWidth = false,
  loading = false,
  loadingLabel = 'Procesando…',
  disabled = false,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const appearance = variant === 'ghost' ? 'ghost' : 'primary';
  const classes = [
    'v-button',
    'v-button--' + appearance,
    (pill || variant === 'pill') && 'v-button--pill',
    (fullWidth || variant === 'full-width') && 'v-button--full',
    className,
  ].filter(Boolean).join(' ');

  const interactiveProps = Component === 'button'
    ? { type, disabled: disabled || loading }
    : { 'aria-disabled': disabled || loading || undefined };

  return (
    <Component
      {...props}
      {...interactiveProps}
      className={classes}
      aria-busy={loading || undefined}
    >
      {loading && <span className="v-spinner" aria-hidden="true" />}
      {loading ? loadingLabel : children}
    </Component>
  );
}
