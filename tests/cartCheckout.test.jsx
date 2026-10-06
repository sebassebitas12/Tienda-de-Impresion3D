import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartPage, CatalogPage, ProductPage } from '../src/pages/Shop.jsx';
import { useAuth } from '../src/hooks/useAuth.js';
import { useCart } from '../src/hooks/useCart.js';
import { useCatalog } from '../src/hooks/useCatalog.js';
import { usePreferences } from '../src/hooks/usePreferences.js';
import { fetchMyOrders, submitCatalogOrder, submitOrderPaymentProof } from '../src/services/commerceService.js';

jest.mock('../src/hooks/useAuth.js', () => ({ useAuth: jest.fn() }));
jest.mock('../src/hooks/useCart.js', () => ({ useCart: jest.fn() }));
jest.mock('../src/hooks/useCatalog.js', () => ({ useCatalog: jest.fn() }));
jest.mock('../src/hooks/usePreferences.js', () => ({ usePreferences: jest.fn() }));
jest.mock('../src/services/commerceService.js', () => ({
  submitCatalogOrder: jest.fn(), fetchMyOrders: jest.fn(), createPaypalCheckout: jest.fn(),
  capturePaypalCheckout: jest.fn(), submitOrderPaymentProof: jest.fn(),
  createCatalogOrderIdempotencyKey: () => 'test-idempotency-123', fetchProductReviews: jest.fn().mockResolvedValue([]),
}));

const cart = { lines: [{ productId: 'p1', color: 'Negro', quantity: 2 }], add: jest.fn(() => true), clear: jest.fn(), remove: jest.fn(), update: jest.fn(), storageError: false, ready: true };
const product = { id: 'p1', name: 'Organizador', description: 'Pieza útil para el taller.', status: 'ACTIVE', currency: 'CRC', material: 'PLA', price: 2500, availableColors: ['Negro'], images: ['/images/first.jpg', '/images/second.jpg'] };
function PathProbe() {
  const location = useLocation();
  return <output>{location.pathname}</output>;
}

function setup(user = { id: 'c1', role: 'customer' }, entry = '/carrito') {
  useAuth.mockReturnValue({ user, token: user ? 'sim-token' : null });
  useCart.mockReturnValue(cart);
  useCatalog.mockReturnValue({ status: 'success', products: [product], retry: jest.fn() });
  usePreferences.mockReturnValue({ language: 'es' });
  fetchMyOrders.mockResolvedValue({ orders: [{ id: 'ord-123', userId: 'c1', status: 'PENDING', paymentStatus: 'UNPAID', total: 5000, subtotalCrc: 5000, orderItems: [] }] });
  return render(<MemoryRouter initialEntries={[entry]}><Routes>
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

  it('crea una orden pendiente, conserva el carrito y abre la elección del método de pago', async () => {
    submitCatalogOrder.mockResolvedValue({ order: { id: 'ord-123', subtotalCrc: 5000, status: 'PENDING', paymentStatus: 'UNPAID' } });
    setup();
    fireEvent.click(screen.getByRole('button', { name: /Continuar al pago/ }));
    expect(await screen.findByRole('heading', { name: /Revisá y pagá tu pedido/ })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /Continuar con PayPal Sandbox/ })).toBeInTheDocument();
    expect(screen.getByText(/Pedido pendiente de pago/)).toBeInTheDocument();
    expect(submitCatalogOrder).toHaveBeenCalledWith(expect.objectContaining({
      items: [{ productId: 'p1', color: 'Negro', quantity: 2 }], idempotencyKey: expect.any(String),
    }), { token: 'sim-token' });
    expect(cart.clear).not.toHaveBeenCalled();
  });

  it('conserva el carrito cuando la API falla', async () => {
    submitCatalogOrder.mockRejectedValue(Object.assign(new Error(), { code: 'PRODUCT_UNAVAILABLE' }));
    setup();
    fireEvent.click(screen.getByRole('button', { name: /Continuar al pago/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('dejó de estar publicado');
    expect(cart.clear).not.toHaveBeenCalled();
  });

  it('envía a revisión un comprobante SINPE con su imagen y mantiene el pedido pendiente', async () => {
    submitOrderPaymentProof.mockImplementation(async payload => ({ order: {
      id: 'ord-123', status: 'PENDING', paymentStatus: 'UNPAID', total: 5000,
      paymentProof: { ...payload, status: 'SUBMITTED', submittedAt: '2026-10-05T12:00:00Z' },
    } }));
    setup({ id: 'c1', role: 'customer' }, '/carrito?orderId=ord-123');
    expect(await screen.findByRole('heading', { name: 'Pedido ord-123' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Número de referencia/), { target: { value: 'SINPE-1234' } });
    fireEvent.change(screen.getByLabelText(/Teléfono SINPE del remitente/), { target: { value: '8888-8888' } });
    const file = new File(['proof'], 'comprobante.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/Foto o captura del comprobante/), { target: { files: [file] } });
    const send = await screen.findByRole('button', { name: /Enviar comprobante para revisión/ });
    await waitFor(() => expect(send).toBeEnabled());
    fireEvent.submit(send.closest('form'));
    await waitFor(() => expect(submitOrderPaymentProof).toHaveBeenCalled());
    expect(await screen.findByText(/Comprobante DEMO enviado al taller/)).toBeInTheDocument();
    expect(submitOrderPaymentProof).toHaveBeenCalledWith(expect.objectContaining({
      orderId: 'ord-123', referenceNumber: 'SINPE-1234', sinpePhone: '8888-8888',
      proofFileName: 'comprobante.png', proofImageDataUrl: expect.stringMatching(/^data:image\/png;base64,/),
    }), { token: 'sim-token' });
    expect(screen.getByText(/el pedido sigue pendiente/i)).toBeInTheDocument();
  });

  it('explica el bloqueo por variante no disponible sin prometer programación automática', () => {
    setup();
    expect(screen.getByText(/Todavía no se registra un pago/)).toBeInTheDocument();
    cleanup();
    cart.lines.push({ productId: 'missing', color: 'Negro', quantity: 1 });
    try {
      setup();
      expect(screen.getByRole('button', { name: /Continuar al pago/ })).toBeDisabled();
      expect(screen.getByText(/Quitalas o elegí otra opción/)).toBeInTheDocument();
    } finally { cart.lines.pop(); }
  });

  it('no permite pagar a quien no inició sesión', async () => {
    setup(null);
    expect(screen.getByRole('button', { name: /Continuar al pago/ })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login');
    expect(submitCatalogOrder).not.toHaveBeenCalled();
    expect(cart.clear).not.toHaveBeenCalled();
  });

  it('distingue sesión administrativa, deshabilita el encargo y ofrece enlace a gestión', async () => {
    setup({ id: 'u1', name: 'Sebastián Flores', role: 'admin' });
    expect(screen.getByText(/Sesión de taller: Sebastián Flores/)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: 'Checkout reservado para clientes' });
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
    setupProduct({ id: 'c1', role: 'customer' });
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

  it('bloquea agregar al carrito a visitantes y los orienta a iniciar sesión o registrarse', async () => {
    setupProduct();
    fireEvent.click(screen.getByRole('radio', { name: 'Negro' }));
    expect(screen.queryByRole('button', { name: /Agregar al carrito/u })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Iniciar sesión para agregar/u })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /Crear cuenta/u })).toHaveAttribute('href', '/registro');
    expect(cart.add).not.toHaveBeenCalled();
    expect(screen.queryByRole('link', { name: 'Ver carrito →' })).not.toBeInTheDocument();
  });

  it('ofrece ver el carrito directamente a una cuenta cliente', async () => {
    setupProduct({ id: 'c1', role: 'customer' });
    fireEvent.click(screen.getByRole('radio', { name: 'Negro' }));
    fireEvent.click(screen.getByRole('button', { name: /Agregar al carrito/u }));

    expect(await screen.findByRole('link', { name: 'Ver carrito →' })).toHaveAttribute('href', '/carrito');
  });
});
