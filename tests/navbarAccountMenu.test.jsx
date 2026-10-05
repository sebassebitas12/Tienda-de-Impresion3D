import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from '../src/app/layout/Navbar.jsx';
import { useTheme } from '../src/hooks/useTheme.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { useAuth } from '../src/hooks/useAuth.js';
import { useCart } from '../src/hooks/useCart.js';
import { useCatalog } from '../src/hooks/useCatalog.js';

jest.mock('../src/hooks/useTheme.js', () => ({ useTheme: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/useCart.js', () => ({ useCart: jest.fn() }));
jest.mock('../src/hooks/useCatalog.js', () => ({ useCatalog: jest.fn() }));

const copy = {
  skip: 'Saltar al contenido', navigation: 'Navegación', home: 'Inicio', shop: 'Tienda', about: 'Sobre nosotros', contact: 'Contacto',
  search: 'Buscar', quote: 'Cotizar pieza', cart: 'Carrito', light: 'Cambiar a tema claro', dark: 'Cambiar a tema oscuro',
  openMenu: 'Abrir menú', close: 'Cerrar', space: 'Mi espacio', guest: 'Cliente no registrado', login: 'Iniciar sesión',
  register: 'Crear cuenta', faq: 'Preguntas frecuentes', support: 'Ayuda y soporte', settings: 'Preferencias de lectura',
};

describe('acceso al espacio de cuenta desde el navbar', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('identifica Mi espacio y ofrece iniciar sesión o crear cuenta al visitante', () => {
    useTheme.mockReturnValue({ theme: 'dark', setTheme: jest.fn() });
    usePreferences.mockReturnValue({ language: 'es', setLanguage: jest.fn(), copy });
    useAuth.mockReturnValue({ user: null, logout: jest.fn(), isPending: false, hasPersistedSession: false });
    useCart.mockReturnValue({ count: 0 });
    useCatalog.mockReturnValue({ products: [], status: 'success' });
    render(<MemoryRouter><Navbar onReading={jest.fn()} /></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: 'Mi espacio' }));

    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute('href', '/registro');
  });
});
