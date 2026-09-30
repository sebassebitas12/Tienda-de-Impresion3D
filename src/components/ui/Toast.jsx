import { IconButton } from './IconButton.jsx';
import './ui.css';

// Dismissal is explicit: important feedback does not disappear on a timer.
export function Toast({ open = true, message, tone = 'info', onDismiss, closeLabel = 'Cerrar notificación' }) {
  return (
    <div className="v-toast-region" role={tone === 'error' ? 'alert' : 'status'} aria-live={tone === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
      {open && message && <div className="v-toast" data-tone={tone}><span>{message}</span>{onDismiss && <IconButton label={closeLabel} onClick={onDismiss}>×</IconButton>}</div>}
    </div>
  );
}
