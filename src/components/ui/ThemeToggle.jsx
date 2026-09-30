import { IconButton } from './IconButton.jsx';

export function ThemeToggle({ theme = 'dark', onToggle, label, ...props }) {
  const light = theme === 'light';
  return (
    <IconButton {...props} label={label || (light ? 'Cambiar al tema oscuro' : 'Cambiar al tema claro')}
      onClick={() => onToggle?.(light ? 'dark' : 'light')}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {light ? <path d="M20.2 15.5A8.7 8.7 0 0 1 8.5 3.8 8.8 8.8 0 1 0 20.2 15.5Z" /> :
          <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>}
      </svg>
    </IconButton>
  );
}
