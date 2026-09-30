import './ui.css';

export function LanguageToggle({ language = 'es', onChange, className = '', ...props }) {
  const english = language === 'en';
  return (
    <button {...props} type="button" className={'v-language-toggle ' + className}
      aria-label={english ? 'Change language to Spanish' : 'Cambiar idioma a inglés'}
      onClick={() => onChange?.(english ? 'es' : 'en')}>
      <span lang="es" data-active={!english}>ES</span><span aria-hidden="true"> / </span><span lang="en" data-active={english}>EN</span>
    </button>
  );
}
