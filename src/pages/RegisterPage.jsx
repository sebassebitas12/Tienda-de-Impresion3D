import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui/index.js';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';

function messageFor(error, copy) {
  if (!error) return '';
  if (error.code === 'AUTH_NOT_CONFIGURED') return copy.authNotConfigured;
  if (error.code === 'INVALID_REGISTER_INPUT') return copy.authRequired;
  if (error.code === 'AUTH_EMAIL_TAKEN') return copy.authEmailTaken;
  if (error.code === 'AUTH_NETWORK') return copy.authNetwork;
  if (error.code === 'INVALID_SESSION') return copy.authInvalidSession;
  return copy.authGenericError;
}

export function RegisterPage() {
  const { copy, language } = usePreferences();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');

  const setField = (field, value) => {
    if (localError) setLocalError('');
    if (auth.error) auth.clearError();
    setForm(current => ({ ...current, [field]: value }));
  };

  const onSubmit = async event => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError(copy.authPasswordMismatch);
      return;
    }

    try {
      await auth.register({ name: form.name, email: form.email, password: form.password });
      const requested = location.state?.from;
      const returnState = location.state?.pendingCartSelection
        ? { pendingCartSelection: location.state.pendingCartSelection }
        : undefined;
      navigate(requested || '/cuenta', { replace: true, state: returnState });
    } catch {
      // Provider exposes the normalized error state to the UI.
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-head">
        <h1>{copy.authRegisterTitle}</h1>
        <p>{copy.authRegisterIntro}</p>
      </div>

      {location.state?.reason === 'customer-cart-required' && <p className="auth-context-notice" role="status">
        {language === 'en'
          ? 'Create a customer account to view your customer cart and continue.'
          : 'Creá una cuenta de cliente para ver tu carrito y continuar.'}
      </p>}
      {location.state?.reason === 'catalog-customer-required' && <p className="auth-context-notice" role="status">
        {language === 'en' ? 'Create a customer account to add this part. Your selected color and quantity will be waiting on the product page.' : 'Creá una cuenta de cliente para agregar esta pieza. Al volver, conservarás el color y la cantidad elegidos.'}
      </p>}

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Input
          id="register-name"
          name="name"
          label={copy.authName}
          autoComplete="name"
          value={form.name}
          onChange={event => setField('name', event.target.value)}
          required
        />
        <Input
          id="register-email"
          name="email"
          type="email"
          label={copy.authEmail}
          autoComplete="email"
          value={form.email}
          onChange={event => setField('email', event.target.value)}
          required
        />
        <Input
          id="register-password"
          name="password"
          type="password"
          label={copy.authPassword}
          autoComplete="new-password"
          value={form.password}
          onChange={event => setField('password', event.target.value)}
          required
        />
        <Input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          label={copy.authConfirmPassword}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={event => setField('confirmPassword', event.target.value)}
          required
        />

        {(localError || auth.error) && (
          <p className="auth-error" role="alert">{localError || messageFor(auth.error, copy)}</p>
        )}

        <Button type="submit" fullWidth loading={auth.pendingAction === 'register'}>
          {copy.register}
        </Button>
      </form>

      <p className="auth-switch">
        {copy.authHasAccount} <Link to="/login" state={{ from: location.state?.from, reason: location.state?.reason }}>{copy.login}</Link>
      </p>
    </div>
  );
}
