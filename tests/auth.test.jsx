import { useEffect } from 'react';
import { describe, expect, jest, test } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '../src/app/providers/AuthProvider.jsx';
import { AppProviders } from '../src/app/providers/AppProviders.jsx';
import { Navbar } from '../src/app/layout/Navbar.jsx';
import { AdminLayout } from '../src/app/layout/AdminLayout.jsx';
import { RequireAuth, RequireRole } from '../src/app/routes/AuthGuards.jsx';
import { LoginPage } from '../src/pages/LoginPage.jsx';
import { RegisterPage } from '../src/pages/RegisterPage.jsx';
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

describe('Navbar account session actions', () => {
  test('oculta el carrito a visitantes y lo muestra a clientes autenticados', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/']}>
        <AppProviders authAdapter={{ restoreSession: async () => null }}>
          <Navbar onReading={jest.fn()} />
        </AppProviders>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Mi Espacio' })).toBeVisible());
    expect(screen.queryByRole('link', { name: /^Carrito/u })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Mi Espacio' }));
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute('href', '/registro');
    unmount();

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppProviders authAdapter={{ restoreSession: async () => customerSession }}>
          <Navbar onReading={jest.fn()} />
        </AppProviders>
      </MemoryRouter>
    );

    expect(await screen.findByRole('link', { name: /^Carrito/u })).toHaveAttribute('href', '/carrito');
  });

  test('envía al admin al dashboard desde el menú Mi cuenta', async () => {
    function CurrentPath() {
      return <output aria-label="Ruta actual">{useLocation().pathname}</output>;
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppProviders authAdapter={{ restoreSession: async () => adminSession }}>
          <Navbar onReading={jest.fn()} />
          <CurrentPath />
        </AppProviders>
      </MemoryRouter>
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Mi Espacio' }));
    const accountLink = await screen.findByRole('link', { name: 'Panel de administración' });
    expect(accountLink).toHaveAttribute('href', '/admin');
    expect(screen.queryByRole('link', { name: /^Carrito/u })).not.toBeInTheDocument();
    await userEvent.click(accountLink);
    await waitFor(() => expect(screen.getByLabelText('Ruta actual')).toHaveTextContent(/^\/admin$/u));
  });

  test('muestra cerrar sesión para usuario autenticado y vuelve al inicio al salir', async () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    function CurrentPath() {
      return <output aria-label="Ruta actual">{useLocation().pathname}</output>;
    }

    render(
      <MemoryRouter initialEntries={['/cuenta']}>
        <AppProviders authAdapter={{ restoreSession: async () => customerSession, logout }}>
          <Navbar onReading={jest.fn()} />
          <CurrentPath />
        </AppProviders>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Mi Espacio' }));
    expect(await screen.findByText('Cliente')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    await waitFor(() => expect(screen.getByLabelText('Ruta actual')).toHaveTextContent(/^\/$/u));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Cliente')).not.toBeInTheDocument();
  });

  test('permite borrar una sesión guardada cuando falla la restauración del servidor', async () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    const adapter = {
      restoreSession: jest.fn().mockRejectedValue(Object.assign(new Error('offline'), { code: 'AUTH_NETWORK' })),
      hasPersistedSession: jest.fn(() => true),
      logout,
    };

    render(
      <MemoryRouter initialEntries={['/cuenta']}>
        <AppProviders authAdapter={adapter}>
          <Navbar onReading={jest.fn()} />
        </AppProviders>
      </MemoryRouter>
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Mi Espacio' }));
    expect(await screen.findByText('Sesión guardada · sin verificar')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).not.toBeInTheDocument();
  });

  test('permite al admin cerrar sesión desde su layout separado', async () => {
    const logout = jest.fn().mockResolvedValue(undefined);
    function CurrentPath() {
      return <output aria-label="Ruta actual">{useLocation().pathname}</output>;
    }

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AppProviders authAdapter={{ restoreSession: async () => adminSession, logout }}>
          <Routes>
            <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
              <Route index element={<div>Dashboard</div>} />
            </Route>
            <Route path="/" element={<div>Inicio público</div>} />
          </Routes>
          <CurrentPath />
        </AppProviders>
      </MemoryRouter>
    );

    expect(await screen.findByRole('link', { name: 'Vértice CR, inicio' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: 'Ver tienda' })).not.toBeInTheDocument();
    await userEvent.click(await screen.findByRole('button', { name: 'Cerrar sesión' }));
    await waitFor(() => expect(screen.getByLabelText('Ruta actual')).toHaveTextContent(/^\/$/u));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Inicio público')).toBeVisible();
  });
});

describe('Auth route guards', () => {
  test('explica por qué el carrito pide sesión y mantiene el aviso al crear cuenta', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/login', state: { from: '/carrito', reason: 'customer-cart-required' } }]}>
        <AppProviders authAdapter={{ restoreSession: async () => null }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
          </Routes>
        </AppProviders>
      </MemoryRouter>
    );

    expect(await screen.findByRole('status')).toHaveTextContent('para ver tu carrito y continuar');
    await userEvent.click(screen.getByRole('link', { name: 'Crear cuenta' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Creá una cuenta de cliente para ver tu carrito y continuar');
  });

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

  test('RequireRole conserva /carrito al mandar a un visitante al login y bloquea Admin', async () => {
    function LocationProbe() {
      const location = useLocation();
      return <output aria-label="Destino solicitado">{`${location.state?.from || ''}:${location.state?.reason || ''}`}</output>;
    }

    const { unmount } = render(
      <AuthProvider adapter={{ restoreSession: async () => null }}>
        <MemoryRouter initialEntries={['/carrito']}>
          <Routes>
            <Route path="/login" element={<><div>LOGIN</div><LocationProbe /></>} />
            <Route element={<RequireRole role="customer" />}>
              <Route path="/carrito" element={<div>CART</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('LOGIN')).toBeVisible());
    expect(screen.getByLabelText('Destino solicitado')).toHaveTextContent('/carrito:customer-cart-required');
    unmount();

    render(
      <AuthProvider adapter={{ restoreSession: async () => adminSession }}>
        <MemoryRouter initialEntries={['/carrito']}>
          <Routes>
            <Route path="/" element={<div>HOME</div>} />
            <Route element={<RequireRole role="customer" />}>
              <Route path="/carrito" element={<div>CART</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByText('HOME')).toBeVisible());
    expect(screen.queryByText('CART')).not.toBeInTheDocument();
  });

  test('LoginPage botones demo rellenan credenciales de Admin y Cliente', async () => {
    const user = userEvent.setup();
    render(
      <AppProviders>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AppProviders>
    );

    const emailInput = screen.getByLabelText(/correo/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);

    const adminBtn = screen.getByRole('button', { name: /admin demo/i });
    const customerBtn = screen.getByRole('button', { name: /cliente demo|customer demo/i });

    expect(adminBtn).toBeInTheDocument();
    expect(customerBtn).toBeInTheDocument();

    await user.click(adminBtn);
    expect(emailInput).toHaveValue('sebas@example.com');
    expect(passwordInput).toHaveValue('demo-admin-2026');

    await user.click(customerBtn);
    expect(emailInput).toHaveValue('ana@example.com');
    expect(passwordInput).toHaveValue('demo-customer-2026');
  });
});
