import './ui.css';

export function LanguageToggle({ language = 'es', onChange, className = '', ...props }) {
  return (
    <div {...props} className={'v-language-toggle ' + className} role="group" aria-label={language === 'en' ? 'Language / Idioma' : 'Idioma / Language'}>
      <button type="button" lang="es" aria-label={language === 'es' ? 'Idioma actual: español' : 'Cambiar idioma a español'} aria-pressed={language === 'es'} onClick={() => onChange?.('es')}>ES</button>
      <button type="button" lang="en" aria-label={language === 'en' ? 'Current language: English' : 'Cambiar idioma a inglés'} aria-pressed={language === 'en'} onClick={() => onChange?.('en')}>EN</button>
    </div>
  );
}
