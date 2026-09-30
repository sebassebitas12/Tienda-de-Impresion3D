import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, MonoLabel } from '../components/ui/index.js';
import { useAuth } from '../hooks/useAuth.js';
import { usePreferences } from '../hooks/usePreferences.js';

function messageFor(error, copy) {
  if (!error) return '';
  if (error.code === 'AUTH_NOT_CONFIGURED') return copy.authNotConfigured;
  if (error.code === 'INVALID_REGISTER_INPUT') return copy.authRequired;
  if (error.code === 'INVALID_SESSION') return copy.authInvalidSession;
  return copy.authGenericError;
}

export function RegisterPage() {
  const { copy } = usePreferences();
  const auth = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [localError, setLocalError] = useState('');

  const setField = (field, value) => {
    setLocalError('');
    auth.clearError();
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
      navigate('/cuenta', { replace: true });
    } catch {
      // Provider exposes the normalized error state to the UI.
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-card-head">
        <MonoLabel>{copy.authRegisterKicker}</MonoLabel>
        <h1>{copy.authRegisterTitle}</h1>
        <p>{copy.authRegisterIntro}</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <Input
          label={copy.authName}
          autoComplete="name"
          value={form.name}
          onChange={event => setField('name', event.target.value)}
          required
        />
        <Input
          type="email"
          label={copy.authEmail}
          autoComplete="email"
          value={form.email}
          onChange={event => setField('email', event.target.value)}
          required
        />
        <Input
          type="password"
          label={copy.authPassword}
          autoComplete="new-password"
          value={form.password}
          onChange={event => setField('password', event.target.value)}
          required
        />
        <Input
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
        {copy.authHasAccount} <Link to="/login">{copy.login}</Link>
      </p>
    </div>
  );
}
