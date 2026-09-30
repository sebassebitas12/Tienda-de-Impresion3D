import { Link } from 'react-router-dom';
import { usePreferences } from '../hooks/usePreferences.js';

export function ConstructionPage({ titleKey }) {
  const { copy } = usePreferences();
  return <section className="page-container"><h1>{copy[titleKey]}</h1><p>{copy.construction}</p>
    <Link className="v-link-text" to="/">{copy.backHome}</Link></section>;
}
