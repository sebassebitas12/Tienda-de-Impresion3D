import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { LoginPage } from '../src/pages/LoginPage.jsx';
import { RegisterPage } from '../src/pages/RegisterPage.jsx';

const mockCustomer = { id: 'customer-1', name: 'Cliente', role: 'customer' };
const mockAuth = { login: jest.fn(), register: jest.fn() };

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: () => mockAuth }));

function PathProbe() {
  const location = useLocation();
  return <><output data-testid="path">{location.pathname}</output><output data-testid="selection">{JSON.stringify(location.state?.pendingCartSelection || null)}</output></>;
}

function renderAuthPage(Page, path) {
  return render(<MemoryRouter initialEntries={[{ pathname: path, state: { from: '/producto/p1?material=PLA', reason: 'catalog-customer-required', pendingCartSelection: { productId: 'p1', color: 'Negro', quantity: 3 } } }]}><PreferencesProvider>
    <Routes><Route path={path} element={<Page />} /><Route path="/producto/:id" element={<PathProbe />} /></Routes>
  </PreferencesProvider></MemoryRouter>);
}

describe('regreso a la pieza después de autenticarse', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('inicia sesión, vuelve al producto y exige que el cliente agregue la pieza', async () => {
    mockAuth.login.mockResolvedValue(mockCustomer);
    renderAuthPage(LoginPage, '/login');
    expect(screen.getByRole('status')).toHaveTextContent('conservarás el color y la cantidad elegidos');
    fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }).closest('form'));
    expect(await screen.findByTestId('path')).toHaveTextContent('/producto/p1');
    expect(screen.getByTestId('selection')).toHaveTextContent(JSON.stringify({ productId: 'p1', color: 'Negro', quantity: 3 }));
  });

  it('crea una cuenta y vuelve al producto sin transferir artículos de un carrito visitante', async () => {
    mockAuth.register.mockResolvedValue(mockCustomer);
    renderAuthPage(RegisterPage, '/registro');
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }).closest('form'));
    expect(await screen.findByTestId('path')).toHaveTextContent('/producto/p1');
    expect(screen.getByTestId('selection')).toHaveTextContent(JSON.stringify({ productId: 'p1', color: 'Negro', quantity: 3 }));
  });
});
