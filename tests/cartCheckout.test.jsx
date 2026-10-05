import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartPage, CatalogPage, ProductPage } from '../src/pages/Shop.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { useCart } from '../src/hooks/useCart.js';
import { useCatalog } from '../src/hooks/useCatalog.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { submitCatalogOrder } from '../src/services/commerceService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/useCart.js', () => ({ useCart: jest.fn() }));
jest.mock('../src/hooks/useCatalog.js', () => ({ useCatalog: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/services/commerceService.js', () => ({ submitCatalogOrder: jest.fn(), createCatalogOrderIdempotencyKey: () => 'test-idempotency-123', fetchProductReviews: jest.fn().mockResolvedValue([]) }));

const cart = { lines: [{ productId: 'p1', color: 'Negro', quantity: 2 }], add: jest.fn(() => true), clear: jest.fn(), remove: jest.fn(), update: jest.fn(), storageError: false, ready: true };
const product = { id: 'p1', name: 'Organizador', description: 'Pieza útil para el taller.', status: 'ACTIVE', currency: 'CRC', material: 'PLA', price: 2500, availableColors: ['Negro'], images: ['/images/first.jpg', '/images/second.jpg'] };
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

function setupProduct(user = null) {
  useAuth.mockReturnValue({ user, token: user ? 'sim-token' : null });
  useCart.mockReturnValue(cart);
  useCatalog.mockReturnValue({ status: 'success', products: [product], retry: jest.fn() });
  usePreferences.mockReturnValue({ language: 'es' });
  return render(<MemoryRouter initialEntries={['/producto/p1']}><Routes>
    <Route path="/producto/:id" element={<ProductPage />} />
  </Routes></MemoryRouter>);
}

describe('confirmación de encargo del carrito', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('identifica al titular sin duplicar una tarjeta de estado de sesión', () => {
    setup({ id: 'c1', name: 'Ana Rodríguez', role: 'customer' });
    expect(screen.getByRole('heading', { name: 'Tu encargo' })).toBeInTheDocument();
    expect(screen.getByText('Ana Rodríguez')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver mi cuenta/ })).toHaveAttribute('href', '/cuenta');
    expect(screen.queryByText(/Sesión de cliente/)).not.toBeInTheDocument();
  });

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

  it('explica el bloqueo por variante no disponible sin prometer programación automática', () => {
    setup();
    expect(screen.getByText(/no cobra ni inicia producción/)).toBeInTheDocument();
    cleanup();
    cart.lines.push({ productId: 'missing', color: 'Negro', quantity: 1 });
    try {
      setup();
      expect(screen.getByRole('button', { name: 'Confirmar encargo' })).toBeDisabled();
      expect(screen.getByText(/Quitalas o elegí otra opción/)).toBeInTheDocument();
    } finally { cart.lines.pop(); }
  });

  it('envía al visitante a iniciar sesión conservando el carrito', async () => {
    setup(null);
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar encargo' }));
    expect(await screen.findByText('/login:')).toBeInTheDocument();
    expect(submitCatalogOrder).not.toHaveBeenCalled();
    expect(cart.clear).not.toHaveBeenCalled();
  });

  it('distingue sesión administrativa, deshabilita el encargo y ofrece enlace a gestión', async () => {
    setup({ id: 'u1', name: 'Sebastián Flores', role: 'admin' });
    expect(screen.getByText(/Sesión de taller: Sebastián Flores/)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Confirmar encargo' });
    expect(btn).toBeDisabled();
    expect(screen.getByText(/Gestionar pedidos en Admin/)).toBeInTheDocument();
  });
});

describe('selección de producto sin sesión', () => {
  afterEach(() => { cleanup(); jest.clearAllMocks(); });

  it('muestra toda la galería y una sola selección de color', async () => {
    setupProduct();
    await act(async () => {});
    expect(screen.queryByRole('combobox', { name: 'Color' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver foto 2' }));
    expect(screen.getByRole('img', { name: 'Organizador · vista 2' })).toHaveAttribute('src', '/images/second.jpg');
    fireEvent.error(screen.getByRole('img', { name: 'Organizador · vista 2' }));
    expect(screen.getByText('Esta foto no está disponible.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver foto 1' }));
    expect(screen.getByRole('img', { name: 'Organizador · vista 1' })).toBeInTheDocument();
  });

  it('permite recorrer las muestras de color con teclado', async () => {
    setupProduct();
    await act(async () => {});
    fireEvent.keyDown(screen.getByRole('radio', { name: 'Negro' }), { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Negro' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: /Agregar al carrito/u })).toBeEnabled();
  });

  it('filtra la tienda por tipo de pieza y conserva materiales', () => {
    useAuth.mockReturnValue({ user: null });
    usePreferences.mockReturnValue({ language: 'es' });
    useCatalog.mockReturnValue({ status: 'success', products: [
      { ...product, name: 'Organizador', category: { id: 'gadgets', name: 'Gadgets' } },
      { ...product, id: 'p2', name: 'Maceta', category: { id: 'deco', name: 'Decoración' } },
    ] });
    render(<MemoryRouter><CatalogPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Decoración' }));
    expect(screen.getByRole('heading', { name: 'Maceta' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Organizador' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PLA' })).toBeInTheDocument();
  });

  it('conserva la selección local y orienta al visitante a login/registro en vez de mostrar acceso al carrito', async () => {
    setupProduct();
    fireEvent.click(screen.getByRole('radio', { name: 'Negro' }));
    fireEvent.click(screen.getByRole('button', { name: /Agregar al carrito/u }));

    expect(cart.add).toHaveBeenCalledWith('p1', 'Negro', 1);
    const notice = await screen.findByText(/guardada en este navegador/u);
    const status = notice.closest('[role="status"]');
    expect(status).toHaveTextContent('guardada en este navegador');
    expect(status).toHaveTextContent('Iniciá sesión');
    expect(status).toHaveTextContent('creá una cuenta');
    expect(screen.queryByRole('link', { name: 'Ver carrito →' })).not.toBeInTheDocument();
  });

  it('ofrece ver el carrito directamente a una cuenta cliente', async () => {
    setupProduct({ id: 'c1', role: 'customer' });
    fireEvent.click(screen.getByRole('radio', { name: 'Negro' }));
    fireEvent.click(screen.getByRole('button', { name: /Agregar al carrito/u }));

    expect(await screen.findByRole('link', { name: 'Ver carrito →' })).toHaveAttribute('href', '/carrito');
  });
});
