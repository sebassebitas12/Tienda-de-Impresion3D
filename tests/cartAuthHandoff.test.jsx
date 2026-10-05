import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { PreferencesProvider } from '../src/app/providers/PreferencesProvider.jsx';
import { LoginPage } from '../src/pages/LoginPage.jsx';
import { RegisterPage } from '../src/pages/RegisterPage.jsx';

const mockCustomer = { id: 'customer-1', name: 'Cliente', role: 'customer' };
const mockImportGuestCart = jest.fn();
const mockAuth = { login: jest.fn(), register: jest.fn() };

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: () => mockAuth }));
jest.mock('../src/hooks/useCart.js', () => ({ useOptionalCart: () => ({ importGuestCart: mockImportGuestCart }) }));

function PathProbe() {
  return <output data-testid="path">{useLocation().pathname}</output>;
}

function renderAuthPage(Page, path) {
  return render(<MemoryRouter initialEntries={[{ pathname: path, state: { from: '/carrito' } }]}><PreferencesProvider>
    <Routes><Route path={path} element={<Page />} /><Route path="/carrito" element={<PathProbe />} /></Routes>
  </PreferencesProvider></MemoryRouter>);
}

describe('continuidad del carrito después de autenticarse', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('incorpora la selección visitante al iniciar sesión desde /carrito', async () => {
    mockAuth.login.mockResolvedValue(mockCustomer);
    renderAuthPage(LoginPage, '/login');
    fireEvent.submit(screen.getByRole('button', { name: /iniciar sesión/i }).closest('form'));
    expect(await screen.findByTestId('path')).toHaveTextContent('/carrito');
    expect(mockImportGuestCart).toHaveBeenCalledWith(mockCustomer);
  });

  it('incorpora la selección visitante al crear cuenta desde /carrito', async () => {
    mockAuth.register.mockResolvedValue(mockCustomer);
    renderAuthPage(RegisterPage, '/registro');
    fireEvent.submit(screen.getByRole('button', { name: /crear cuenta/i }).closest('form'));
    expect(await screen.findByTestId('path')).toHaveTextContent('/carrito');
    expect(mockImportGuestCart).toHaveBeenCalledWith(mockCustomer);
  });
});
