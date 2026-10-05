import { usePreferences } from '../../hooks/usePreferences.js';

export function PageLoading() {
  const { language } = usePreferences();
  return <section className="page-loading-skeleton" aria-busy="true">
    <span role="status" aria-live="polite">{language === 'en' ? 'Loading section…' : 'Cargando sección…'}</span>
    <div aria-hidden="true"><i /><i /><i /></div>
  </section>;
}
