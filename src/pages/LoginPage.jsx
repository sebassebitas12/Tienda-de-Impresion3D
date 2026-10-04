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
      navigate(requested || (user.role === 'admin' ? '/admin' : '/cuenta'), { replace: true });
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

      {location.state?.reason === 'admin-session-rejected' && <p className="auth-context-notice" role="status">
        {language === 'en'
          ? 'The local API rejected the previous Admin session. Sign in again with an active Admin account on this same address; access checks remain enabled.'
          : 'La API local rechazó la sesión anterior de Administración. Volvé a iniciar sesión con una cuenta Admin activa en esta misma dirección; la protección sigue habilitada.'}
      </p>}

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Input
          type="email"
          label={copy.authEmail}
          autoComplete="email"
          value={form.email}
          onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
          required
        />
        <Input
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

      <p className="auth-switch">
        {copy.authNoAccount} <Link to="/registro">{copy.register}</Link>
      </p>
    </div>
  );
}
