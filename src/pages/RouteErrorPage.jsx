import { Link } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences.js';

export function RouteErrorPage() {
  const { copy } = usePreferences();
  return <main className="page-container"><h1>{copy.routeError}</h1><p role="alert">{copy.routeErrorHint}</p>
    <Link className="v-link-text" to="/">{copy.backHome}</Link></main>;
}
