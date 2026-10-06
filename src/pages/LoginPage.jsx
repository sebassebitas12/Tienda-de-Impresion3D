import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui/index.js';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';

function messageFor(error, copy) {
  if (!error) return '';
  if (error.code === 'AUTH_NOT_CONFIGURED') return copy.authNotConfigured;
  if (error.code === 'INVALID_CREDENTIALS_INPUT') return copy.authRequired;
  if (error.code === 'AUTH_INVALID_CREDENTIALS') return copy.authInvalidCredentials;
  if (error.code === 'AUTH_INACTIVE_USER') return copy.authInactive;
  if (error.code === 'AUTH_NETWORK') return copy.authNetwork;
  if (error.code === 'INVALID_SESSION') return copy.authInvalidSession;
  return copy.authGenericError;
}

export function LoginPage() {
  const { copy, language } = usePreferences();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const user = await auth.login(form);
      const requested = location.state?.from;
      const returnState = user.role === 'customer' && location.state?.pendingCartSelection
        ? { pendingCartSelection: location.state.pendingCartSelection }
        : undefined;
      navigate(requested || (user.role === 'admin' ? '/admin' : '/cuenta'), { replace: true, state: returnState });
    } catch {
      // Provider exposes the normalized error state to the UI.
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-head">
        <h1>{copy.authLoginTitle}</h1>
        <p>{copy.authLoginIntro}</p>
      </div>

      {location.state?.reason === 'session-expired' && <p className="auth-context-notice" role="status">
        {language === 'en'
          ? 'Your session expired. Sign in again to continue where you left off; your draft has been preserved.'
          : 'Tu sesión expiró. Volvé a iniciar sesión para continuar donde estabas; tu borrador fue preservado.'}
      </p>}

      {location.state?.reason === 'admin-session-rejected' && <p className="auth-context-notice" role="status">
        {language === 'en'
          ? 'The local API rejected the previous Admin session. Sign in again with an active Admin account on this same address; access checks remain enabled.'
          : 'La API local rechazó la sesión anterior de Administración. Volvé a iniciar sesión con una cuenta Admin activa en esta misma dirección; la protección sigue habilitada.'}
      </p>}

      {location.state?.reason === 'customer-cart-required' && <p className="auth-context-notice" role="status">
        {language === 'en'
          ? 'Sign in or create a customer account to view your customer cart and continue.'
          : 'Iniciá sesión o creá una cuenta de cliente para ver tu carrito y continuar.'}
      </p>}
      {location.state?.reason === 'catalog-customer-required' && <p className="auth-context-notice" role="status">
        {language === 'en' ? 'Sign in with a customer account to add this part. Your selected color and quantity will be waiting on the product page.' : 'Iniciá sesión con una cuenta de cliente para agregar esta pieza. Al volver, conservarás el color y la cantidad elegidos.'}
      </p>}

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Input
          id="login-email"
          name="email"
          type="email"
          label={copy.authEmail}
          autoComplete="email"
          value={form.email}
          onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
          required
        />
        <Input
          id="login-password"
          name="password"
          type="password"
          label={copy.authPassword}
          autoComplete="current-password"
          value={form.password}
          onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
          required
        />

        {auth.error && <p className="auth-error" role="alert">{messageFor(auth.error, copy)}</p>}

        <Button type="submit" fullWidth loading={auth.pendingAction === 'login'}>
          {copy.login}
        </Button>
      </form>

      <div className="auth-demo-helper" aria-label={language === 'en' ? 'Quick demo access' : 'Acceso rápido de evaluación (Demo)'}>
        <span className="auth-demo-helper__label">
          {language === 'en' ? 'Demo evaluation accounts:' : 'Cuentas demo de evaluación:'}
        </span>
        <div className="auth-demo-helper__buttons">
          <button
            type="button"
            className="auth-demo-btn"
            onClick={() => setForm({ email: 'sebas@example.com', password: 'demo-admin-2026' })}
            aria-label={language === 'en' ? 'Fill Admin demo credentials' : 'Cargar credenciales Admin Demo'}
          >
            {language === 'en' ? 'Admin Demo' : 'Admin Demo'}
          </button>
          <button
            type="button"
            className="auth-demo-btn"
            onClick={() => setForm({ email: 'ana@example.com', password: 'demo-customer-2026' })}
            aria-label={language === 'en' ? 'Fill Customer demo credentials' : 'Cargar credenciales Cliente Demo'}
          >
            {language === 'en' ? 'Customer Demo' : 'Cliente Demo'}
          </button>
        </div>
      </div>

      <p className="auth-switch">
        {copy.authNoAccount} <Link to="/registro" state={{ from: location.state?.from, reason: location.state?.reason }}>{copy.register}</Link>
      </p>
    </div>
  );
}
