import { useEffect } from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../src/app/providers/AuthProvider.jsx';
import { RequireAuth, RequireRole } from '../src/app/routes/AuthGuards.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { AuthServiceError, createAuthService } from '../src/services/authService.js';

const adminSession = {
  user: { id: 'u-admin', name: 'Admin', email: 'admin@example.com', role: 'admin', status: 'ACTIVE' },
  token: 'test-token',
};

const customerSession = {
  user: { id: 'u-customer', name: 'Cliente', email: 'client@example.com', role: 'customer', status: 'ACTIVE' },
  token: 'customer-token',
};

describe('Auth service contract', () => {
  test('normaliza una sesión válida devuelta por el adapter', async () => {
    const login = jest.fn().mockResolvedValue(adminSession);
    const service = createAuthService({ login });
    const session = await service.login({ email: 'admin@example.com', password: 'secret' });

    expect(login).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'secret' });
    expect(session.user.role).toBe('admin');
    expect(session.token).toBe('test-token');
  });

  test('rechaza sesiones incompletas aunque el adapter responda', async () => {
    const service = createAuthService({
      login: jest.fn().mockResolvedValue({ user: { id: 'x', email: 'x@example.com' } }),
    });

    await expect(service.login({ email: 'x@example.com', password: 'secret' }))
      .rejects.toMatchObject({ code: 'INVALID_SESSION' });
  });

  test('sin adapter de backend login falla explícitamente como no configurado', async () => {
    const service = createAuthService();

    await expect(service.login({ email: 'x@example.com', password: 'secret' }))
      .rejects.toBeInstanceOf(AuthServiceError);
    await expect(service.login({ email: 'x@example.com', password: 'secret' }))
      .rejects.toMatchObject({ code: 'AUTH_NOT_CONFIGURED' });
  });
});

describe('AuthProvider', () => {
  test('restaura sesión y expone rol', async () => {
    function Probe() {
      const auth = useAuth();
      return <div>{auth.isRestoring ? 'restoring' : auth.user?.role || 'guest'}</div>;
    }

    render(
      <AuthProvider adapter={{ restoreSession: jest.fn().mockResolvedValue(adminSession) }}>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('admin')).toBeVisible());
  });

  test('login actualiza sesión y logout vuelve a guest', async () => {
    const login = jest.fn().mockResolvedValue(customerSession);
    const logout = jest.fn().mockResolvedValue(undefined);

    function Probe() {
      const auth = useAuth();
      useEffect(() => {
        if (auth.isRestoring) return;
      }, [auth.isRestoring]);

      return (
        <>
          <span>{auth.user?.email || 'guest'}</span>
          <button onClick={() => auth.login({ email: 'client@example.com', password: 'secret' })}>Login</button>
          <button onClick={() => auth.logout()}>Logout</button>
        </>
      );
    }

    render(
      <AuthProvider adapter={{ restoreSession: async () => null, login, logout }}>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('guest')).toBeVisible());
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));
    await waitFor(() => expect(screen.getByText('client@example.com')).toBeVisible());
    await userEvent.click(screen.getByRole('button', { name: 'Logout' }));
    await waitFor(() => expect(screen.getByText('guest')).toBeVisible());
    expect(logout).toHaveBeenCalled();
  });
});

describe('Auth route guards', () => {
  test('RequireAuth redirige invitado a login', async () => {
    render(
      <AuthProvider adapter={{ restoreSession: async () => null }}>
        <MemoryRouter initialEntries={['/cuenta']}>
          <Routes>
            <Route path="/login" element={<div>LOGIN PAGE</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/cuenta" element={<div>ACCOUNT PAGE</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('LOGIN PAGE')).toBeVisible());
    expect(screen.queryByText('ACCOUNT PAGE')).not.toBeInTheDocument();
  });

  test('RequireRole permite admin y bloquea customer', async () => {
    const { unmount } = render(
      <AuthProvider adapter={{ restoreSession: async () => adminSession }}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>HOME</div>} />
            <Route path="/login" element={<div>LOGIN</div>} />
            <Route element={<RequireRole role="admin" />}>
              <Route path="/admin" element={<div>ADMIN</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('ADMIN')).toBeVisible());
    unmount();

    render(
      <AuthProvider adapter={{ restoreSession: async () => customerSession }}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>HOME</div>} />
            <Route path="/login" element={<div>LOGIN</div>} />
            <Route element={<RequireRole role="admin" />}>
              <Route path="/admin" element={<div>ADMIN</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('HOME')).toBeVisible());
    expect(screen.queryByText('ADMIN')).not.toBeInTheDocument();
  });
});
