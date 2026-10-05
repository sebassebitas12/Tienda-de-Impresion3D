import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartPage } from '../src/pages/Shop.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { useCart } from '../src/hooks/useCart.js';
import { useCatalog } from '../src/hooks/useCatalog.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { submitCatalogOrder } from '../src/services/commerceService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/useCart.js', () => ({ useCart: jest.fn() }));
jest.mock('../src/hooks/useCatalog.js', () => ({ useCatalog: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/services/commerceService.js', () => ({ submitCatalogOrder: jest.fn(), createCatalogOrderIdempotencyKey: () => 'test-idempotency-123' }));

const cart = { lines: [{ productId: 'p1', color: 'Negro', quantity: 2 }], clear: jest.fn(), remove: jest.fn(), update: jest.fn(), storageError: false };
const product = { id: 'p1', name: 'Organizador', status: 'ACTIVE', currency: 'CRC', material: 'PLA', price: 2500, availableColors: ['Negro'] };
function PathProbe() {
  const location = useLocation();
  return <output>{`${location.pathname}:${location.state?.orderConfirmation?.id || ''}`}</output>;
}

function setup(user = { id: 'c1', role: 'customer' }) {
  useAuth.mockReturnValue({ user, token: user ? 'sim-token' : null });
  useCart.mockReturnValue(cart);
  useCatalog.mockReturnValue({ status: 'success', products: [product], retry: jest.fn() });
  usePreferences.mockReturnValue({ language: 'es' });
  return render(<MemoryRouter initialEntries={['/carrito']}><Routes>
    <Route path="/carrito" element={<CartPage />} />
    <Route path="*" element={<PathProbe />} />
  </Routes></MemoryRouter>);
}

describe('confirmación de encargo del carrito', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('manda solo variante/cantidad con sesión, limpia tras éxito y va a /cuenta con acuse', async () => {
    submitCatalogOrder.mockResolvedValue({ order: { id: 'ord-123', subtotalCrc: 5000 } });
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar encargo' }));
    expect(await screen.findByText('/cuenta:ord-123')).toBeInTheDocument();
    expect(submitCatalogOrder).toHaveBeenCalledWith(expect.objectContaining({
      items: [{ productId: 'p1', color: 'Negro', quantity: 2 }], idempotencyKey: expect.any(String),
    }), { token: 'sim-token' });
    expect(cart.clear).toHaveBeenCalledTimes(1);
  });

  it('conserva el carrito cuando la API falla', async () => {
    submitCatalogOrder.mockRejectedValue(Object.assign(new Error(), { code: 'PRODUCT_UNAVAILABLE' }));
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar encargo' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('dejó de estar publicado');
    expect(cart.clear).not.toHaveBeenCalled();
  });

  it('envía al visitante a iniciar sesión conservando el carrito', async () => {
    setup(null);
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar encargo' }));
    expect(await screen.findByText('/login:')).toBeInTheDocument();
    expect(submitCatalogOrder).not.toHaveBeenCalled();
    expect(cart.clear).not.toHaveBeenCalled();
  });
});
