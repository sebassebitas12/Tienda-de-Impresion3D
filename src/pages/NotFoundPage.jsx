import { Link } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences.js';

export function NotFoundPage() {
  const { copy } = usePreferences();
  return <section className="page-container"><h1>{copy.notFound}</h1><Link className="v-link-text" to="/">{copy.backHome}</Link></section>;
}
