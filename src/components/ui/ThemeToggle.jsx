import { IconButton } from './IconButton.jsx';

export function ThemeToggle({ theme = 'dark', onToggle, label, className = '', ...props }) {
  const light = theme === 'light';

  return (
    <IconButton
      {...props}
      className={`theme-toggle-control ${className}`}
      label={label || (light ? 'Cambiar al tema oscuro' : 'Cambiar al tema claro')}
      onClick={() => onToggle?.(light ? 'dark' : 'light')}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {light ? (
          <svg className="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.2 15.5A8.7 8.7 0 0 1 8.5 3.8 8.8 8.8 0 1 0 20.2 15.5Z" />
          </svg>
        ) : (
          <svg className="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3.6" />
            <path d="M12 2.5v2.1m0 14.8v2.1M4.6 4.6l1.5 1.5m11.8 11.8 1.5 1.5M2.5 12h2.1m14.8 0h2.1M6.1 17.9l-1.5 1.5M19.4 4.6l-1.5 1.5" />
          </svg>
        )}
      </span>
    </IconButton>
  );
}
