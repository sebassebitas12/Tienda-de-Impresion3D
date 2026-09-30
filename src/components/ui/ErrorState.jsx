import { Button } from './Button.jsx';
import './ui.css';

export function ErrorState({ title = 'No pudimos completar la acción', description, onRetry, retryLabel = 'Reintentar', loading = false, ...props }) {
  return (
    <section {...props} className="v-feedback v-feedback--error" role="alert">
      <h3>{title}</h3>{description && <p>{description}</p>}
      {onRetry && <Button variant="ghost" loading={loading} onClick={onRetry}>{retryLabel}</Button>}
    </section>
  );
}
